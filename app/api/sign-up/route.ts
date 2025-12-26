import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import bcrypt from "bcryptjs";
import { sendVerificationEmails } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUser = await UserModel.findOne({ username, isVerfied: true });

    if (existingUser) {
      return Response.json(
        { success: false, message: "User already exists " },
        { status: 400 }
      );
    }
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailReponse = await sendVerificationEmails(
      email,
      username,
      verifyCode
    );

    if (!emailReponse.success) {
      return Response.json(
        { success: false, message: emailReponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "User registerd successfully please verify email ",
      },
      { status: 201 }
    );
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
