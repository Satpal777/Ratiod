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
} from "./polls.controller";

const router = Router();

router.get("/", requireAuth, listPollsHandler);
router.get("", requireAuth, listPollsHandler);
router.post("/", requireAuth, createPollHandler);
router.post("", requireAuth, createPollHandler);

router.get("/analytics/overall", requireAuth, overallAnalyticsHandler);
router.get("/analytics/overall/", requireAuth, overallAnalyticsHandler);
router.get("/:pollId/voters", requireAuth, pollVotersHandler);
router.get("/:pollId/voters/", requireAuth, pollVotersHandler);

router.get("/:slug", getPublicPollHandler);
router.post("/:slug/responses", submitResponseHandler);
router.get("/:pollId/analytics", requireAuth, analyticsHandler);
router.post("/:pollId/publish", requireAuth, publishResultsHandler);

export default router;
