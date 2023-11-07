import { dbConnect } from "@/backend/config/dbConnect";
import { webhookCheckout } from "@/backend/controllers/paymentControllers";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>();

dbConnect();

router.post(webhookCheckout);

export async function POST(
  request: NextRequest,
  ctx: RequestContext
): Promise<void | Response> {
  return router.run(request, ctx) as Promise<void | Response>;
}

