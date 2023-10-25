import { NextRequest, NextResponse } from "next/server";
import { catchAsycnErrors } from "../middlewares/catchAsyncErrors";
import User from "../models/user";

// Register User => /api/auth/register
export const registerUser = catchAsycnErrors(async (req: NextRequest) => {
  const body = await req.json();

  const { name, email, password } = body;

  const user = await User.create({
    name,
    email,
    password,
  });

  return NextResponse.json({
    success: true,
  });
});
