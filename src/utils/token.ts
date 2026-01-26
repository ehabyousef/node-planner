import jwt from "jsonwebtoken";
import { userType } from "./types";
export const genToken = (user: userType) => {
  return jwt.sign(
    { id: user._id, email: user.email, userName: user.userName },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
  );
};
