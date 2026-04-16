import { Router, type IRouter } from "express";
import healthRouter from "./health";
import propertiesRouter from "./properties";
import visitsRouter from "./visits";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(propertiesRouter);
router.use(visitsRouter);
router.use(chatRouter);

export default router;
