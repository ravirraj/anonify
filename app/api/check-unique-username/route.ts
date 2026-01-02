import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import { usernameValidation } from "@/schemas/signupSchema";
import { z } from "zod";

const queryValidation = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const quParams = { username: searchParams.get("username") || "" };

    const parsedParams = queryValidation.safeParse(quParams);
    if (!parsedParams.success) {
      return Response.json(
        { success: false, message: "Username is required " },
        { status: 400 }
      );
    }
    const existingUser = await UserModel.findOne({
      username: parsedParams.data.username,
      isVerified: true,
    });
    if (existingUser) {
      return Response.json(
        { success: false, message: "Username is already taken " },
        { status: 200 }
      );
    } else {
      return Response.json(
        { success: true, message: "Username is available " },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Error wile checking the uniquness ", error);
    return Response.json(
      { success: false, message: "Internal Server Error " },
      { status: 500 }
    );
  }
}
