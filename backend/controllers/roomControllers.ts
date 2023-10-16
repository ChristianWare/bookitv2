import { NextRequest, NextResponse } from "next/server";
import Room from "../models/room";

export const allRoooms = async (request: NextRequest) => {
  return NextResponse.json({
    data: "hello",
  });
};

export const newRoom = async (req: NextRequest) => {
  const body = await req.json();

  const room = await Room.create(body);

  return NextResponse.json({
    success: true,
    room,
  });
};
