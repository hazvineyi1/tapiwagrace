import { Router, type IRouter } from "express";
import bookingsRouter from "./bookings";
import contactRouter from "./contact";
import healthRouter from "./health";
import newsletterRouter from "./newsletter";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookingsRouter);
router.use(contactRouter);
router.use(newsletterRouter);

export default router;
