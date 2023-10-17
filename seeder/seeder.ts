import Room from "../backend/models/room";
import mongoose from "mongoose";
import { rooms } from "./data";
import * as dotenv from "dotenv";

dotenv.config();

const seedRooms = async () => {
  try {
    await mongoose.connect(process.env.DB_URI as string);

    await Room.deleteMany();
    console.log("Rooms are deleted");

    await Room.insertMany(rooms);
    console.log("Rooms are added");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

seedRooms();
