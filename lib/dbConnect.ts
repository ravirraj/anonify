import mongoose from "mongoose";

type ConnectionObj = {
  isConnected?: number;
};
const connection: ConnectionObj = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Connected To Database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "", {});

    connection.isConnected = db.connections[0].readyState;
    console.log("Db connected successfully");
  } catch (e) {
    console.log("Error", e);
    process.exit(1);
  }
}
export {dbConnect}