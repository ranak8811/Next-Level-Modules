import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/index.js";
import { pool } from "../db/index.js";
import type { Role } from "../types/index.js";

const authMiddleware = (...roles: Role[]) => {
  //   console.log(roles);
  return async (req: Request, res: Response, next: NextFunction) => {
    //   console.log("this is protected route");

    try {
      //   console.log(req);

      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      const decode = jwt.verify(
        token as string,
        config.jwt_secret,
      ) as JwtPayload;

      //   console.log(decode);

      const user = await pool.query(
        `
        Select * from users where email=$1
    `,
        [decode.email],
      );

      //   console.log(user.rows[0]);

      if (user.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (!user.rows[0].is_active) {
        return res.status(403).json({
          success: false,
          message: "User Forbidden",
        });
      }

      if (roles.length && !roles.includes(user.rows[0].role)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      req.user = decode;

      //   console.log(req);

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authMiddleware;
