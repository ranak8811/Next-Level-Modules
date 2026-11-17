import type { Request, Response } from "express";
import { authService } from "./auth.service.js";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);

    // console.log(result);

    res.status(200).send({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error: any) {
    {
      res.status(500).send({
        success: false,
        message: error?.message,
        data: error,
      });
    }
  }
};

export const authController = {
  loginUser,
};
