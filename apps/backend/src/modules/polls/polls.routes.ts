import { Router } from "express";
import { requireAuth } from "../../common/middlewares/auth.middleware";
import {
  analyticsHandler,
  createPollHandler,
  getPublicPollHandler,
  listPollsHandler,
  publishResultsHandler,
  submitResponseHandler,
  overallAnalyticsHandler,
  pollVotersHandler,
  terminatePollHandler,
  listAnsweredPollsHandler,
  respondentAnalyticsHandler,
} from "./polls.controller";

const router = Router();

router.get("/", requireAuth, listPollsHandler);
router.get("", requireAuth, listPollsHandler);
router.post("/", requireAuth, createPollHandler);
router.post("", requireAuth, createPollHandler);

router.get("/answered", requireAuth, listAnsweredPollsHandler);
router.get("/answered/", requireAuth, listAnsweredPollsHandler);

router.get("/analytics/overall", requireAuth, overallAnalyticsHandler);
router.get("/analytics/overall/", requireAuth, overallAnalyticsHandler);
router.get("/:pollId/voters", requireAuth, pollVotersHandler);
router.get("/:pollId/voters/", requireAuth, pollVotersHandler);

router.post("/:pollId/terminate", requireAuth, terminatePollHandler);

router.get("/:slug", getPublicPollHandler);
router.post("/:slug/responses", submitResponseHandler);
router.get("/:pollId/analytics", requireAuth, analyticsHandler);
router.get("/:pollId/analytics/respondent", requireAuth, respondentAnalyticsHandler);
router.post("/:pollId/publish", requireAuth, publishResultsHandler);

export default router;
