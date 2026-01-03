import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import bcrypt from "bcryptjs";
import { sendVerificationEmails } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    // console.log(username,email,password)

    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUser) {
      return Response.json(
        { success: false, message: "User already exists " },
        { status: 400 }
      );
    }
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email ",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        //added username update for existing unverified user
        //delete this if causes issues
        existingUserByEmail.username = username;
        await existingUserByEmail.save();
        console.log(existingUserByEmail)
      }
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
    //todo : hold this for now
    const emailReponse = await sendVerificationEmails(
      email,
      username,
      verifyCode
    );
console.log(emailReponse)
    if (!emailReponse.success) {
      return Response.json(
        { success: false, message: emailReponse.message },
        { status: 500 }
      );
    }
    console.log("this is existing user", existingUser);
    console.log();
    return Response.json(
      {
        success: true,
        message: "User registered successfully please verify email ",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("error registering User", error);
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
