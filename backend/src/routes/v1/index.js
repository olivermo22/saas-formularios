import { Router } from "express";
import { metaRouter } from "./meta.js";
import { authRouter } from "./auth.js";
import { meRouter } from "./me.js";
import { formsRouter } from "./forms.js";
import { publicRouter } from "./public.js";
import { responsesRouter } from "./responses.js";

export const v1Router = Router();

v1Router.use(metaRouter);
v1Router.use(authRouter);
v1Router.use(meRouter);
v1Router.use(formsRouter);
v1Router.use(publicRouter);
v1Router.use(responsesRouter);

