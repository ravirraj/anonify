//coded with ai so certain parts may be incorrect check once before using


import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import { messageSchema } from "@/schemas/messageScheam";
import { z } from "zod";
export async function POST(request: Request) {
  dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = session.user._id;
  try {
    const { message } = await request.json();
    const validMessage = z.object({
        content: messageSchema,
    })
    const parsedMessage = validMessage.safeParse(message);
    if (!parsedMessage.success) {
      return Response.json(
        { success: false, message: "Invalid message format" },
        { status: 400 }
      );
    }
    const user = await UserModel.findById(userId);
    if (!user || !user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User is not accepting messages" },
        { status: 400 }
      );
    }
    user.messages.push(message);
    await user.save();
    return Response.json(
      { success: true, message: "Message submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "someting went wrong while submitting the message",
      },
      { status: 400 }
    );
  }
}
