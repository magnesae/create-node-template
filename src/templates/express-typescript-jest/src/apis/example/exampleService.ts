import "dotenv/config";
import * as ExampleRepository from "./exampleRepository.js";

export const getTest = async (): Promise<string> => {
  return "Hello world from /example";
};

export const getExampleIds = async (exampleId: number): Promise<object> => {
  const tokenIds = await ExampleRepository.getExampleIds(exampleId);

  return tokenIds;
};
