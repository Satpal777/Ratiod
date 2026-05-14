import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../lib/auth";
import {
  createPoll,
  getCreatorAnalytics,
  getPublicPoll,
  listCreatorPolls,
  publishResults,
  submitResponse,
  getOverallAnalytics,
  getPollVoters,
  terminatePoll,
  listAnsweredPolls,
  getRespondentAnalytics,
} from "./polls.service";

function paramValue(value: string | string[] | undefined, name: string) {
  if (typeof value === "string" && value.trim()) return value;
  throw new Error(`${name} is required.`);
}

function sendError(res: Response, error: unknown) {
  const message = error instanceof Error ? error.message : "Something went wrong.";
  const status =
    message.includes("not found") ? 404 :
    message.includes("own") || message.includes("sign in") ? 403 :
    message.includes("expired") || message.includes("already") ? 409 :
    400;

  res.status(status).json({ message });
}

async function getOptionalUserId(req: Request) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return session?.user?.id;
}

export async function createPollHandler(req: Request, res: Response) {
  try {
    const poll = await createPoll(req.auth!.user.id, req.body);
    res.status(201).json({ poll });
  } catch (error) {
    sendError(res, error);
  }
}

export async function listPollsHandler(req: Request, res: Response) {
  try {
    const polls = await listCreatorPolls(req.auth!.user.id);
    res.json({ polls });
  } catch (error) {
    sendError(res, error);
  }
}

export async function getPublicPollHandler(req: Request, res: Response) {
  try {
    const data = await getPublicPoll(paramValue(req.params.slug, "Poll slug"));
    res.json(data);
  } catch (error) {
    sendError(res, error);
  }
}

export async function submitResponseHandler(req: Request, res: Response) {
  try {
    const userId = await getOptionalUserId(req);
    const result = await submitResponse(paramValue(req.params.slug, "Poll slug"), req.body, userId, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });
    res.status(201).json(result);
  } catch (error) {
    sendError(res, error);
  }
}

export async function analyticsHandler(req: Request, res: Response) {
  try {
    const analytics = await getCreatorAnalytics(
      paramValue(req.params.pollId, "Poll id"),
      req.auth!.user.id,
    );
    res.json({ analytics });
  } catch (error) {
    sendError(res, error);
  }
}

export async function publishResultsHandler(req: Request, res: Response) {
  try {
    const result = await publishResults(
      paramValue(req.params.pollId, "Poll id"),
      req.auth!.user.id,
    );
    res.json(result);
  } catch (error) {
    sendError(res, error);
  }
}

export async function overallAnalyticsHandler(req: Request, res: Response) {
  try {
    const analytics = await getOverallAnalytics(req.auth!.user.id);
    res.json({ analytics });
  } catch (error) {
    sendError(res, error);
  }
}

export async function pollVotersHandler(req: Request, res: Response) {
  try {
    const voters = await getPollVoters(
      paramValue(req.params.pollId, "Poll id"),
      req.auth!.user.id,
    );
    res.json({ voters });
  } catch (error) {
    sendError(res, error);
  }
}

export async function terminatePollHandler(req: Request, res: Response) {
  try {
    const poll = await terminatePoll(
      paramValue(req.params.pollId, "Poll id"),
      req.auth!.user.id,
    );
    res.json({ poll });
  } catch (error) {
    sendError(res, error);
  }
}

export async function listAnsweredPollsHandler(req: Request, res: Response) {
  try {
    const polls = await listAnsweredPolls(req.auth!.user.id);
    res.json({ polls });
  } catch (error) {
    sendError(res, error);
  }
}

export async function respondentAnalyticsHandler(req: Request, res: Response) {
  try {
    const analytics = await getRespondentAnalytics(
      paramValue(req.params.pollId, "Poll id"),
      req.auth!.user.id,
    );
    res.json({ analytics });
  } catch (error) {
    sendError(res, error);
  }
}
