import { Router } from "express";
import pollsRoutes from "../modules/polls/polls.routes";

const router = Router();

router.use("/polls", pollsRoutes);

export default router;
