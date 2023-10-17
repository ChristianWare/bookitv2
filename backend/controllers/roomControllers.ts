import { NextRequest, NextResponse } from "next/server";
import Room, { IRoom } from "../models/room";
import ErrorHandler from "../utils/errorHandler";
import { catchAsycnErrors } from "../middlewares/catchAsyncErrors";
import APIFilters from "../utils/apiFilters";

// Get all rooms => /api/rooms
export const allRoooms = catchAsycnErrors(async (req: NextRequest) => {
  const resPerPage: number = 8;

  // const rooms = await Room.find();

  const { searchParams } = new URL(req.url);

  const queryStr: any = {};

  searchParams.forEach((value, key) => {
    queryStr[key] = value;
  });

  const apiFilters = new APIFilters(Room, queryStr).search();

  const rooms: IRoom[] = await apiFilters.query;

  return NextResponse.json({
    success: true,
    resPerPage,
    rooms,
  });
});

// Create new room => /api/admin/rooms
export const newRoom = catchAsycnErrors(async (req: NextRequest) => {
  const body = await req.json();

  const room = await Room.create(body);

  return NextResponse.json({
    success: true,
    room,
  });
});

// Get room details => /api/rooms/:id
export const getRoomDetails = catchAsycnErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const room = await Room.findById(params.id);

    if (!room) {
      throw new ErrorHandler("Room not found", 404);
    }

    return NextResponse.json({
      success: true,
      room,
    });
  }
);

// Update room details => /api/admin/rooms/:id
export const updateRoom = catchAsycnErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    let room = await Room.findById(params.id);
    const body = await req.json();

    if (!room) {
      throw new ErrorHandler("Room not found", 404);
    }

    room = await Room.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    return NextResponse.json({
      success: true,
      room,
    });
  }
);

// Delete room details => /api/admin/rooms/:id
export const deleteRoom = catchAsycnErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    let room = await Room.findById(params.id);

    if (!room) {
      throw new ErrorHandler("Room not found", 404);
    }

    // To do: delete images associated with the room

    await room.deleteOne();

    return NextResponse.json({
      success: true,
    });
  }
);
