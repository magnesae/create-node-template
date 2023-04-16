import Joi from "joi";
import { eoaValidation } from "../../utils/customValidation.js";

export const getTest = Joi.object({
  exampleKeyRequired: Joi.string().required(),
  exampleKeyNotRequired: Joi.string().allow(""),
});
