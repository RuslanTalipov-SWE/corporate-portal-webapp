import { NextApiRequest } from "next";
import { Session } from "next-auth";

interface NextApiRequestWithSession extends NextApiRequest {
  session: Session;
}

// Export the custom interface
export type { NextApiRequestWithSession };
