import { NextRequest, NextResponse } from "next/server";

export const allRoooms = async(request: NextRequest) => {
  return NextResponse.json({
    data: "hello",
  });
}
