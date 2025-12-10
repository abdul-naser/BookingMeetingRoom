import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";



const router = Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const validRoles = ["user", "admin"];
const userRole = validRoles.includes(role) ? role : "user";

  if (!name || !email || !password)
    return res.status(400).json({ msg: "Please fill all fields" });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ msg: "Email already registered" });

  const hash = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    passwordHash: hash,
    role: userRole
  });

  res.json({ msg: "User registered", name: newUser.name,email:newUser.email,password:newUser.passwordHash });
});


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "secret123",
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});


export default router;
