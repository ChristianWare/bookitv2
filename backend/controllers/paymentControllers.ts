import { NextRequest, NextResponse } from "next/server";
import { catchAsycnErrors } from "../middlewares/catchAsyncErrors";
import Room from "../models/room";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Genereate stripe checkout session => /api/payment/checkout_session/:roomId
export const stripeCheckoutSession = catchAsycnErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { searchParams } = new URL(req.url);

    const checkInDate = searchParams.get("checkInDate");
    const checkOutDate = searchParams.get("checkOutDate");
    const daysOfStay = searchParams.get("daysOfStay");
    const roomAmount = searchParams.get("amount");

    // Get Room Details
    const room = await Room.findById(params.id);

    // Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      paymenet_method_types: ["card"],
      success_url: `${process.env.API_URI}/bookings/me`,
      cancel_url: `${process.env.API_URI}/room/${room?._id}`,
      customer_email: req.user.email,
      client_reference_id: params?.id,
      metadata: { checkInDate, checkOutDate, daysOfStay },
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Number(roomAmount) * 100,
            product_data: {
              name: room?.name,
              description: room?.description,
              images: [`${room?.images[0]?.url}`],
            },
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json(session);
  }
);
