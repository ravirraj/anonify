import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import bcrypt from "bcryptjs";
import { sendVerificationEmails } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
  } catch (error) {
    console.error("error registring User", error);
    return Response.json(
      {
        message: "Error registing user",
        success: true,
      },
      {
        status: 500,
      }
    );
  }
}
