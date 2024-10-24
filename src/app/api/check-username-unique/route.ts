import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpScehema";

const UsernameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      console.log("usernameErrors-hello", usernameErrors);
      return Response.json(
        {
          success: false,
          message: usernameErrors[0],
          errors: usernameErrors,
        },
        {
          status: 400,
        }
      );
    }
    const { username } = result.data;
    console.log("username-hello", username);
    const existingVerifiedUser = await User.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json({
      success: true,
      message: "Username is available",
    });
  } catch (e) {
    console.log(e);
    return Response.json(
      {
        success: false,
        message: "Failed to check username",
      },
      {
        status: 500,
      }
    );
  }
}
