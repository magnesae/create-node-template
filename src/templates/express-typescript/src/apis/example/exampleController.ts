import "dotenv/config";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { SuccessResponse } from "../../utils/apiResponse.js";
import Logger from "../../middlewares/logger.js";
import * as ExampleService from "./exampleService.js";

/**** Get *****/

// Define a route handler for the default home page of admin
export const getTest: RequestHandler = async (_, res) => {
  const example = await ExampleService.getTest();
  Logger.info("Logger getTest example");
  const response = new SuccessResponse(null, example);
  res.status(StatusCodes.OK).send(response);
};

/***** Post  *****/
