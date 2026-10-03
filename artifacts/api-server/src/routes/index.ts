import { Router, type IRouter } from "express";
import healthRouter from "./health";
import paymobRouter from "./paymob";
import booksRouter from "./books";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/paymob", paymobRouter);
router.use("/books", booksRouter);

export default router;
