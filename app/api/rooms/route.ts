import { dbConnect } from "@/backend/config/dbConnect";
import { allRoooms } from "@/backend/controllers/roomControllers";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {
  params: {
    id: string;
  };
}

const router = createEdgeRouter<NextRequest, RequestContext>();

dbConnect();

router.get(allRoooms);

export async function GET(
  request: NextRequest,
  ctx: RequestContext
): Promise<void | Response> {
  return router.run(request, ctx) as Promise<void | Response>;
}

