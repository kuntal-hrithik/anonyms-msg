import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

export interface User extends Document {
  username: string;
  email: string;
  verifyCode: string;
  verifyCodeExpired: Date;
  password: string;
  isAcceptingMessages: boolean;
  isVerified: boolean;
  messages: Message[];
}

const userSchema: Schema<User> = new Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
      "please provide a valid email address",
    ],
  },
  verifyCode: { type: String, required: true },
  verifyCodeExpired: { type: Date, required: true },
  password: { type: String, required: true },
  isAcceptingMessages: { type: Boolean, required: true, default: false },
  isVerified: { type: Boolean, default: false },
  messages: [messageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
