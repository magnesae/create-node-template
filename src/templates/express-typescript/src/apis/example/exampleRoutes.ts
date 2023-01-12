import Router from "express";
import "express-async-errors";
import * as ExampleController from "./exampleController.js";

const exampleRoutes = Router();

// Get Routes
exampleRoutes.get("/", ExampleController.getTest);

// Post Routes

export default exampleRoutes;
