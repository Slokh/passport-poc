import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const query = req.query;
    const address = query.address as string;
    const { path } = req.body;

    await prisma.mapping.upsert({
      where: { address },
      update: { path },
      create: {
        address,
        path,
      },
    });

    res.status(200).send({});
  } else {
    const query = req.query;
    const address = query.address as string;
    const data = await prisma.mapping.findFirst({
      where: { address },
    });
    if (data?.path) {
      res.status(200).send(data);
    } else {
      res.status(404).send({});
    }
  }
};

export default handler;
