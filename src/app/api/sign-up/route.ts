import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();
    const verifyCode = Math.floor(1000 + Math.random() * 9000).toString();
    if (!email || !username || !password) {
      return Response.json(
        {
          success: false,
          message: "Username, email, and password are required.",
        },
        { status: 400 }
      );
    }
    const existingUserVerifiedByUsername = await User.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          sucess: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            sucess: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpired = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();

      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode,
        verifyCodeExpired: expiryDate,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (emailResponse.success) {
      return Response.json(
        {
          success: true,
          message: emailResponse.message,
        },
        {
          status: 201,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Error sending verification email",
        },
        {
          status: 500,
        }
      );
    }
  } catch (e) {
    console.log(e);
    return Response.json({
      success: false,
      message: "Error creating user",
    });
  }
}
