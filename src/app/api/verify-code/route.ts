import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, code } = await req.json();
    const decodeUsername = decodeURIComponent(username);
    const user = await User.findOne({ username: decodeUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 500,
        }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpired) > new Date();
    if (isCodeValid || isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json({
        success: false,
        message: "Code expired",
      });
    } else {
      return Response.json({
        success: false,
        message: "Invalid code",
      });
    }
  } catch (e) {
    console.error("error verifying user", e);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
