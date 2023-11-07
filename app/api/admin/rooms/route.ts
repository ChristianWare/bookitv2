import { dbConnect } from "@/backend/config/dbConnect";
import { allAdminRooms, newRoom } from "@/backend/controllers/roomControllers";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {
  params: {
    id: string;
  };
}

const router = createEdgeRouter<NextRequest, RequestContext>();

dbConnect();

router.use(isAuthenticatedUser, authorizeRoles("admin")).get(allAdminRooms);
router.use(isAuthenticatedUser, authorizeRoles("admin")).post(newRoom);

export async function GET(
  request: NextRequest,
  ctx: RequestContext
): Promise<void | Response> {
  return router.run(request, ctx) as Promise<void | Response>;
}


export async function POST(
  request: NextRequest,
  ctx: RequestContext
): Promise<void | Response> {
  return router.run(request, ctx) as Promise<void | Response>;
}

