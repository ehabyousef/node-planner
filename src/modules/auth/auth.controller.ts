import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { User } from "../../DB/models/user.model";
import { genToken } from "../../utils/token";

export const Register = expressAsyncHandler(async (req, res) => {
  const existUser = await User.findOne({ email: req.body.email });

  if (existUser) {
    res.status(400).json({ message: "user already exist log in please" });
  }

  // hash pass
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    email: req.body.email,
    password: hashPass,
    userName: req.body.userName,
  });
  await user.save();

  res.status(201).json({ message: "user created", token: genToken(user) });
});

export const Login = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(400).json({ message: "Invalid email or password" });
    return;
  }
  const isPass = await bcrypt.compare(req.body.password, user.password);
  if (!isPass) {
    res.status(400).json({ message: "Invalid email or password" });
    return;
  }

  res.status(200).json({ message: "logged in", token: genToken(user) });
});
