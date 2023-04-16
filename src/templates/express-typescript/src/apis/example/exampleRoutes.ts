import Router from "express";
import "express-async-errors";
import * as ExampleController from "./exampleController.js";
import * as JoiValidator from "../../middlewares/joiValidator.js";
import * as ExampleSchemas from "./exampleSchemas.js";

const exampleRoutes = Router();

// Get Routes
exampleRoutes.get(
  "/",
  JoiValidator.body(ExampleSchemas.getTest),
  ExampleController.getTest,
);

// Post Routes

export default exampleRoutes;
