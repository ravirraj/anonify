import UserModel from "@/models/User.models";
import { dbConnect } from "@/lib/dbConnect";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    console.log(user);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { success: true, message: "Accound verified successfully" },
        { status: 200 }
      );
    } else if (isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code is expired please sign in again",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "incorrect verification Code " },
        { status: 400 }
      );
    }
  } catch (er) {
    console.log("Error while verifying the code ", er);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
