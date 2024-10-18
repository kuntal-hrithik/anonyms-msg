import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpScehema";

const UserNameQuerySchema = z.object({
  usename: userNameValidation,
});

