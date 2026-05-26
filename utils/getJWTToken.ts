import { NextApiRequest } from "next";

export function getToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  return authHeader ? authHeader.split(" ")[1] : null;
}
