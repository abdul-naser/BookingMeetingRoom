// middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

// للتحقق من أي مستخدم (user أو admin)
export const verifyUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded: any = jwt.verify(token, "secret123");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// للتحقق من المسؤول فقط
export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  verifyUser(req, res, () => {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Admins only" });
    next();
  });
};
