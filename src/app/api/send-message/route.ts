import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();
  const { username, content } = await req.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }
    //is user accpeting the messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "user is not accepting messages",
        },
        { status: 400 }
      );
    }
    const newMessage = {
      content,
      createdAt: new Date(),
    };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "message sent successfully",
      },
      { status: 200 }
    );
  } catch (e) {
    console.log("an unexpected error occurred", e);
    return Response.json(
      {
        success: false,
        message: "failed to send message",
      },
      { status: 500 }
    );
  }
}
