import type { NextApiRequest, NextApiResponse } from "next";

import { isValidBody, predict } from "@/util/server";

type Data = {
  data: string;
};

type PostBody = {
  code: string;
  lang: string;
};

interface PostReq extends NextApiRequest {
  body: Body;
}

export default async function handler(
  req: PostReq,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      return;
    }

    if (!isValidBody<PostBody>(req.body, ["code", "lang"])) {
      return res.status(402);
    }

    const { code, lang } = req.body;

    const textResponse = await predict(code, lang);

    res.status(200).json({ data: textResponse });
  } catch (error) {
    console.log(error);
    res.status(500).end('Internal server error');
  }
}
