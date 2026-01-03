import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.models";

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
    const { acceptingMessage } = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptingMessage },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "error while updating the state of accepting message ",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: true, message: "successfully updated the state" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "someting went wrong while toggeling the accept message",
      },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const userId = user?._id;
  try {
    const existingUser =
      await UserModel.findById(userId).select("isAcceptingMessage");
    if (!existingUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessage: existingUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Somthing went wrong while fetching the accept message state",
      },
      { status: 500 }
    );
  }
}
