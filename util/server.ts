import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export function isValidBody<T extends Record<string, unknown>>(
  body: any,
  fields: (keyof T)[]
): body is T {
  return Object.keys(body).every((key) => fields.includes(key));
}

export const predict = async (code: string, lang: string): Promise<string> => {
  try {
    const { data } = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Describe all security flaws in the following ${lang} code with the response orgnized like "Line X: Description" for each security flaw found:\n\n${code}`,
      // prompt: `Explain any security flaws in the following ${lang} code. Organize the response by prefacing the description of each security flaw with the line number it occured on.\n\n${code}`,
      // prompt: `Describe any security flaws in the following ${lang} code. If there are security flaws present in the code, response should be organized by the number of the line the error occurs in; Example: "Line X: description"\n\n${code}`,
      // prompt: `For the following ${lang} code, for any security flaw display the line number the flaw occurs in and a description of what the security vulnerability is in the format of "Line 1: Description":\n\n${code}`,
      //   prompt: `Explain any security flaws in the following ${lang} code:\n\n${code}`,
    });

    const textResponse: string = data.choices[0].text ?? "";
    return textResponse;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};
