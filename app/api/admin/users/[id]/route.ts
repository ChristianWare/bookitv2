import { dbConnect } from "@/backend/config/dbConnect";
import {
  deleteUser,
  getUserDetails,
  updateUser,
} from "@/backend/controllers/authControllers";

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

router.use(isAuthenticatedUser, authorizeRoles("admin"));

router.get(getUserDetails);
router.put(updateUser);
router.delete(deleteUser);

export async function GET(
  request: NextRequest,
  ctx: RequestContext
): Promise<void | Response> {
  return router.run(request, ctx) as Promise<void | Response>;
}

export async function PUT(
  request: NextRequest,
  ctx: RequestContext
): Promise<void | Response> {
  return router.run(request, ctx) as Promise<void | Response>;
}

export async function DELETE(
  request: NextRequest,
  ctx: RequestContext
): Promise<void | Response> {
  return router.run(request, ctx) as Promise<void | Response>;
}
