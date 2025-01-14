import { Router } from "express";
import { chat, template } from "../controllers/ai.controller";

const router: Router = Router();

router.post("/chat", chat);
router.post("/template", template);

export default router;
