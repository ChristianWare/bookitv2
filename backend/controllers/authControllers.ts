import { NextRequest, NextResponse } from "next/server";
import { catchAsycnErrors } from "../middlewares/catchAsyncErrors";
import User from "../models/user";
import ErrorHandler from "../utils/errorHandler";
import { delete_file, upload_file } from "../utils/cloudinary";
import { resetPasswordHTMLTemplate } from "../utils/emailTemplates";
import sendEmail from "../utils/sendEmail";

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

// Update User Profile => /api/me/update
export const updateProfile = catchAsycnErrors(async (req: NextRequest) => {
  const body = await req.json();

  const userData = {
    name: body.name,
    email: body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, userData);

  return NextResponse.json({
    success: true,
    user,
  });
});

// Update Password => /api/me/update_password
export const updatePassword = catchAsycnErrors(async (req: NextRequest) => {
  const body = await req.json();

  const user = await User.findById(req?.user?._id).select("+password");

  const isMatched = await user.comparePassword(body.oldPassword);

  if (!isMatched) {
    throw new ErrorHandler("Old password is incorrect", 400);
  }

  user.password = body.password;
  await user.save();

  return NextResponse.json({
    success: true,
  });
});

// Update user avatar => /api/me/upload_avatar
export const uploadAvatar = catchAsycnErrors(async (req: NextRequest) => {
  const body = await req.json();

  const avatarResponse = await upload_file(body?.avatar, "bookit/avatars");

  // Remove avatar from cloudinary
  if (req?.user?.avatar?.public_id) {
    await delete_file(req?.user?.avatar?.public_id);
  }

  const user = await User.findByIdAndUpdate(req?.user?._id, {
    avatar: avatarResponse,
  });

  return NextResponse.json({
    success: true,
    user,
  });
});

// Forgor password => /api/password/forgot
export const forgotPassword = catchAsycnErrors(async (req: NextRequest) => {
  const body = await req.json();

  const user = await User.findOne({ email: body.email });

  if (!user) {
    throw new ErrorHandler("User not found with this email", 404);
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save();

  // Create reset password url
  const resetUrl = `${process.env.API_URI}/password/reset/${resetToken}`;

  const message = resetPasswordHTMLTemplate(user?.name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "BookIT Password Recovery",
      message,
    });
  } catch (error: any) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    throw new ErrorHandler(error?.message, 500);
  }

  return NextResponse.json({
    success: true,
    user,
  });
});
