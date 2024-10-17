import mongoose from "mongoose";

type connectoionObject = {
  isConnected?: number;
};

const connection: connectoionObject = {};

export async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected to the database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("connected to the database");
  } catch (error) {
    console.log("error connecting to the database", error);
    process.exit(1);
  }
}

export default dbConnect;
