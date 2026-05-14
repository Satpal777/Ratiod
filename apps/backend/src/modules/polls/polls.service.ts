import { randomUUID } from "node:crypto";
import { and, asc, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "../../db/db";
import {
  analyticsSnapshots,
  pollQuestions,
  pollResponses,
  pollResultPublications,
  polls,
  questionOptions,
  responseAnswers,
  user,
} from "../../db/schemas";
import { getSocketServer } from "../../sockets";
import { pollRoom, SOCKET_EVENTS } from "../../sockets/socket-events";

type PollMode = "anonymous" | "authenticated";

export type CreatePollInput = {
  title: string;
  description?: string;
  mode: PollMode;
  expiresAt?: string | null;
  questions: Array<{
    text: string;
    description?: string;
    isRequired: boolean;
    options: string[];
  }>;
};

export type SubmitResponseInput = {
  anonymousSessionToken?: string;
  answers: Array<{
    questionId: string;
    selectedOptionId: string;
  }>;
};

function makeSlug() {
  return Math.random().toString(36).slice(2, 10);
}

function makeAnonymousToken() {
  return randomUUID().replaceAll("-", "");
}

function isExpired(poll: { expiresAt: Date | null }) {
  return Boolean(poll.expiresAt && poll.expiresAt.getTime() <= Date.now());
}

function normalizeCreateInput(input: CreatePollInput) {
  const title = input.title?.trim();
  if (!title) throw new Error("Poll title is required.");

  if (!["anonymous", "authenticated"].includes(input.mode)) {
    throw new Error("Poll mode must be anonymous or authenticated.");
  }

  if (!Array.isArray(input.questions) || input.questions.length === 0) {
    throw new Error("At least one question is required.");
  }

  const questions = input.questions.map((question, questionIndex) => {
    const text = question.text?.trim();
    if (!text) throw new Error(`Question ${questionIndex + 1} text is required.`);

    const options = question.options
      .map((option) => option?.trim())
      .filter(Boolean);

    if (options.length < 2) {
      throw new Error(`Question ${questionIndex + 1} needs at least two options.`);
    }

    return {
      text,
      description: question.description?.trim() || null,
      isRequired: question.isRequired !== false,
      options,
    };
  });

  const expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
  if (expiresAt && Number.isNaN(expiresAt.getTime())) {
    throw new Error("Expiry time is invalid.");
  }

  return {
    title,
    description: input.description?.trim() || null,
    mode: input.mode,
    expiresAt,
    questions,
  };
}

async function getPollRowsBySlug(slug: string) {
  const [poll] = await db.select().from(polls).where(eq(polls.slug, slug)).limit(1);
  if (!poll) return null;
  return getPollRows(poll.id);
}

async function getPollRows(pollId: string) {
  const [poll] = await db.select().from(polls).where(eq(polls.id, pollId)).limit(1);
  if (!poll) return null;

  const questions = await db
    .select()
    .from(pollQuestions)
    .where(eq(pollQuestions.pollId, poll.id))
    .orderBy(asc(pollQuestions.orderIndex));

  const questionIds = questions.map((question) => question.id);
  const options = questionIds.length
    ? await db
        .select()
        .from(questionOptions)
        .where(inArray(questionOptions.questionId, questionIds))
        .orderBy(asc(questionOptions.orderIndex))
    : [];

  return {
    ...poll,
    isExpired: isExpired(poll),
    questions: questions.map((question) => ({
      ...question,
      options: options.filter((option) => option.questionId === question.id),
    })),
  };
}

async function ensureCreator(pollId: string, userId: string) {
  const poll = await getPollRows(pollId);
  if (!poll) throw new Error("Poll not found.");
  if (poll.creatorId !== userId) throw new Error("You do not own this poll.");
  return poll;
}

async function completedResponseCount(pollId: string) {
  const [row] = await db
    .select({ total: count() })
    .from(pollResponses)
    .where(
      and(eq(pollResponses.pollId, pollId), eq(pollResponses.status, "completed")),
    );

  return row?.total ?? 0;
}

export async function createPoll(userId: string, input: CreatePollInput) {
  const data = normalizeCreateInput(input);

  let slug = makeSlug();
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const existing = await db.select({ id: polls.id }).from(polls).where(eq(polls.slug, slug)).limit(1);
    if (existing.length === 0) break;
    slug = makeSlug();
  }

  const [poll] = await db
    .insert(polls)
    .values({
      creatorId: userId,
      title: data.title,
      description: data.description,
      slug,
      mode: data.mode,
      status: "active",
      expiresAt: data.expiresAt,
    })
    .returning();

  for (const [questionIndex, question] of data.questions.entries()) {
    const [createdQuestion] = await db
      .insert(pollQuestions)
      .values({
        pollId: poll.id,
        text: question.text,
        description: question.description,
        isRequired: question.isRequired,
        orderIndex: questionIndex,
      })
      .returning();

    await db.insert(questionOptions).values(
      question.options.map((option, optionIndex) => ({
        questionId: createdQuestion.id,
        text: option,
        orderIndex: optionIndex,
      })),
    );
  }

  return getPollRows(poll.id);
}

export async function listCreatorPolls(userId: string) {
  const rows = await db
    .select()
    .from(polls)
    .where(eq(polls.creatorId, userId))
    .orderBy(desc(polls.createdAt));

  return rows.map((poll) => ({ ...poll, isExpired: isExpired(poll) }));
}

export async function listAnsweredPolls(userId: string) {
  const answeredPolls = await db
    .select({
      id: polls.id,
      title: polls.title,
      slug: polls.slug,
      isResultPublished: polls.isResultPublished,
      status: polls.status,
      submittedAt: pollResponses.submittedAt,
    })
    .from(pollResponses)
    .innerJoin(polls, eq(pollResponses.pollId, polls.id))
    .where(and(eq(pollResponses.respondentId, userId), eq(pollResponses.status, "completed")))
    .orderBy(desc(pollResponses.submittedAt));
  
  return answeredPolls;
}

export async function terminatePoll(pollId: string, userId: string) {
  const poll = await ensureCreator(pollId, userId);
  
  if (poll.status === "closed" || poll.status === "expired") {
    return poll; // Already terminated
  }
  
  await db
    .update(polls)
    .set({ status: "closed" })
    .where(eq(polls.id, poll.id));
    
  return { ...poll, status: "closed" };
}

export async function getPublicPoll(slug: string) {
  const poll = await getPollRowsBySlug(slug);
  if (!poll) throw new Error("Poll not found.");

  if (poll.isResultPublished) {
    const result = await getPublishedResults(poll.id);
    return { view: "results", poll, result };
  }

  return { view: "form", poll };
}

export async function submitResponse(
  slug: string,
  input: SubmitResponseInput,
  sessionUserId?: string,
  requestMeta?: { ipAddress?: string; userAgent?: string },
) {
  const poll = await getPollRowsBySlug(slug);
  if (!poll) throw new Error("Poll not found.");
  if (poll.status !== "active") throw new Error("This poll is not accepting responses.");
  if (poll.isExpired) {
    await db.update(polls).set({ status: "expired" }).where(eq(polls.id, poll.id));
    throw new Error("This poll has expired.");
  }
  if (poll.mode === "authenticated" && !sessionUserId) {
    throw new Error("You must sign in to answer this poll.");
  }

  if (poll.maxResponses) {
    const currentResponses = await completedResponseCount(poll.id);
    if (currentResponses >= poll.maxResponses) {
      throw new Error("This poll has reached its response limit.");
    }
  }

  const answers = Array.isArray(input.answers) ? input.answers : [];
  const answerByQuestionId = new Map(
    answers.map((answer) => [answer.questionId, answer.selectedOptionId]),
  );

  for (const question of poll.questions) {
    const selectedOptionId = answerByQuestionId.get(question.id);
    if (question.isRequired && !selectedOptionId) {
      throw new Error(`Missing answer for "${question.text}".`);
    }
    if (!selectedOptionId) continue;

    const optionBelongsToQuestion = question.options.some(
      (option) => option.id === selectedOptionId,
    );
    if (!optionBelongsToQuestion) {
      throw new Error(`Invalid option selected for "${question.text}".`);
    }
  }

  const anonymousSessionToken =
    poll.mode === "anonymous"
      ? input.anonymousSessionToken || makeAnonymousToken()
      : null;

  if (!poll.allowDuplicateResponses) {
    if (poll.mode === "authenticated" && sessionUserId) {
      const existing = await db
        .select({ id: pollResponses.id })
        .from(pollResponses)
        .where(
          and(
            eq(pollResponses.pollId, poll.id),
            eq(pollResponses.respondentId, sessionUserId),
            eq(pollResponses.status, "completed"),
          ),
        )
        .limit(1);
      if (existing.length) throw new Error("You have already answered this poll.");
    }

    if (poll.mode === "anonymous" && anonymousSessionToken) {
      const existing = await db
        .select({ id: pollResponses.id })
        .from(pollResponses)
        .where(
          and(
            eq(pollResponses.pollId, poll.id),
            eq(pollResponses.anonymousSessionToken, anonymousSessionToken),
            eq(pollResponses.status, "completed"),
          ),
        )
        .limit(1);
      if (existing.length) throw new Error("This browser has already answered this poll.");
    }
  }

  const [response] = await db
    .insert(pollResponses)
    .values({
      pollId: poll.id,
      respondentId: poll.mode === "authenticated" ? sessionUserId : null,
      anonymousSessionToken,
      status: "completed",
      submittedAt: new Date(),
      ipAddress: requestMeta?.ipAddress,
      userAgent: requestMeta?.userAgent,
    })
    .returning();

  const answerRows = poll.questions
    .map((question) => ({
      questionId: question.id,
      selectedOptionId: answerByQuestionId.get(question.id),
    }))
    .filter(
      (answer): answer is { questionId: string; selectedOptionId: string } =>
        Boolean(answer.selectedOptionId),
    )
    .map((answer) => ({
      responseId: response.id,
      questionId: answer.questionId,
      selectedOptionId: answer.selectedOptionId,
    }));

  if (answerRows.length) {
    await db.insert(responseAnswers).values(answerRows);
  }

  const analytics = await calculateAnalytics(poll.id);
  emitPollUpdate(poll.id, analytics);

  return { responseId: response.id, anonymousSessionToken, analytics };
}

export async function calculateAnalytics(pollId: string) {
  const poll = await getPollRows(pollId);
  if (!poll) throw new Error("Poll not found.");

  const responses = await db
    .select()
    .from(pollResponses)
    .where(
      and(eq(pollResponses.pollId, poll.id), eq(pollResponses.status, "completed")),
    );
  const responseIds = responses.map((response) => response.id);
  const answers = responseIds.length
    ? await db
        .select()
        .from(responseAnswers)
        .where(inArray(responseAnswers.responseId, responseIds))
    : [];

  const summaries = poll.questions.map((question) => {
    const questionAnswers = answers.filter((answer) => answer.questionId === question.id);
    const options = question.options.map((option) => {
      const optionCount = questionAnswers.filter(
        (answer) => answer.selectedOptionId === option.id,
      ).length;

      return {
        id: option.id,
        text: option.text,
        count: optionCount,
        percentage: responses.length
          ? Math.round((optionCount / responses.length) * 100)
          : 0,
      };
    });

    return {
      id: question.id,
      text: question.text,
      isRequired: question.isRequired,
      answeredCount: questionAnswers.length,
      skippedCount: Math.max(responses.length - questionAnswers.length, 0),
      options,
    };
  });

  const analytics = {
    pollId: poll.id,
    totalResponses: responses.length,
    uniqueRespondents: new Set(
      responses.map(
        (response) => response.respondentId || response.anonymousSessionToken || response.id,
      ),
    ).size,
    participationRate: poll.maxResponses
      ? Math.round((responses.length / poll.maxResponses) * 100)
      : null,
    questionSummaries: summaries,
    calculatedAt: new Date().toISOString(),
  };

  await db
    .insert(analyticsSnapshots)
    .values({
      pollId: poll.id,
      totalResponses: analytics.totalResponses,
      uniqueRespondents: analytics.uniqueRespondents,
      questionSummaries: analytics.questionSummaries,
      lastCalculatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: analyticsSnapshots.pollId,
      set: {
        totalResponses: analytics.totalResponses,
        uniqueRespondents: analytics.uniqueRespondents,
        questionSummaries: analytics.questionSummaries,
        lastCalculatedAt: new Date(),
      },
    });

  return analytics;
}

export async function getCreatorAnalytics(pollId: string, userId: string) {
  await ensureCreator(pollId, userId);
  return calculateAnalytics(pollId);
}

export async function getRespondentAnalytics(pollId: string, userId: string) {
  const responses = await db
    .select()
    .from(pollResponses)
    .where(and(eq(pollResponses.pollId, pollId), eq(pollResponses.respondentId, userId)));
  if (responses.length === 0) {
    throw new Error("You have not answered this poll.");
  }
  return calculateAnalytics(pollId);
}

export async function publishResults(pollId: string, userId: string) {
  const poll = await ensureCreator(pollId, userId);
  const analytics = await calculateAnalytics(poll.id);

  await db
    .insert(pollResultPublications)
    .values({
      pollId: poll.id,
      publishedById: userId,
      snapshotData: analytics,
      isPublic: true,
    })
    .onConflictDoUpdate({
      target: pollResultPublications.pollId,
      set: {
        publishedById: userId,
        publishedAt: new Date(),
        snapshotData: analytics,
        isPublic: true,
      },
    });

  const [updatedPoll] = await db
    .update(polls)
    .set({
      isResultPublished: true,
      resultVisibility: "public",
      status: poll.status === "active" ? "closed" : poll.status,
    })
    .where(eq(polls.id, poll.id))
    .returning();

  emitPollUpdate(poll.id, analytics);
  return { poll: updatedPoll, analytics };
}

export async function getPublishedResults(pollId: string) {
  const [publication] = await db
    .select()
    .from(pollResultPublications)
    .where(
      and(
        eq(pollResultPublications.pollId, pollId),
        eq(pollResultPublications.isPublic, true),
      ),
    )
    .limit(1);

  return publication?.snapshotData ?? null;
}

function emitPollUpdate(pollId: string, analytics: Awaited<ReturnType<typeof calculateAnalytics>>) {
  const io = getSocketServer();
  if (!io) return;

  io.to(pollRoom(pollId)).emit(SOCKET_EVENTS.RESPONSE_COUNT, {
    pollId,
    totalResponses: analytics.totalResponses,
  });
  io.to(pollRoom(pollId)).emit(SOCKET_EVENTS.ANALYTICS_UPDATED, analytics);
}

export async function getOverallAnalytics(userId: string) {
  const userPolls = await db
    .select({
      id: polls.id,
      title: polls.title,
      mode: polls.mode,
      status: polls.status,
      isResultPublished: polls.isResultPublished,
    })
    .from(polls)
    .where(eq(polls.creatorId, userId));
  const pollIds = userPolls.map((p) => p.id);

  if (pollIds.length === 0) {
    return {
      totalPolls: 0,
      totalResponses: 0,
      uniqueRespondents: 0,
      publishedPolls: 0,
      activePolls: 0,
      statusCounts: [],
      modeCounts: [],
      pollBreakdown: [],
    };
  }

  const snapshots = await db.select().from(analyticsSnapshots).where(inArray(analyticsSnapshots.pollId, pollIds));
  const snapshotByPollId = new Map(snapshots.map((snapshot) => [snapshot.pollId, snapshot]));
  
  let totalResponses = 0;
  let uniqueRespondents = 0;
  
  for (const snap of snapshots) {
    totalResponses += snap.totalResponses;
    uniqueRespondents += snap.uniqueRespondents;
  }

  const statusCounts = Object.entries(
    userPolls.reduce<Record<string, number>>((acc, poll) => {
      acc[poll.status] = (acc[poll.status] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([label, value]) => ({ label, value }));

  const modeCounts = Object.entries(
    userPolls.reduce<Record<string, number>>((acc, poll) => {
      acc[poll.mode] = (acc[poll.mode] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([label, value]) => ({ label, value }));

  return {
    totalPolls: pollIds.length,
    totalResponses,
    uniqueRespondents,
    publishedPolls: userPolls.filter((poll) => poll.isResultPublished).length,
    activePolls: userPolls.filter((poll) => poll.status === "active").length,
    statusCounts,
    modeCounts,
    pollBreakdown: userPolls
      .map((poll) => {
        const snapshot = snapshotByPollId.get(poll.id);
        return {
          id: poll.id,
          title: poll.title,
          mode: poll.mode,
          status: poll.status,
          responses: snapshot?.totalResponses ?? 0,
          uniqueRespondents: snapshot?.uniqueRespondents ?? 0,
        };
      })
      .sort((a, b) => b.responses - a.responses)
      .slice(0, 8),
  };
}

export async function getPollVoters(pollId: string, userId: string) {
  const poll = await ensureCreator(pollId, userId);
  
  if (poll.mode !== "authenticated") {
    throw new Error("Voters list is only available for authenticated polls.");
  }

  const responses = await db
    .select({
      responseId: pollResponses.id,
      submittedAt: pollResponses.submittedAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image
      }
    })
    .from(pollResponses)
    .innerJoin(user, eq(pollResponses.respondentId, user.id))
    .where(and(eq(pollResponses.pollId, pollId), eq(pollResponses.status, "completed")))
    .orderBy(desc(pollResponses.submittedAt));

  const responseIds = responses.map((r) => r.responseId);
  const answers = responseIds.length
    ? await db
        .select()
        .from(responseAnswers)
        .where(inArray(responseAnswers.responseId, responseIds))
    : [];

  return responses.map((r) => ({
    ...r,
    answers: answers
      .filter((a) => a.responseId === r.responseId)
      .map((a) => ({ questionId: a.questionId, optionId: a.selectedOptionId }))
  }));
}
