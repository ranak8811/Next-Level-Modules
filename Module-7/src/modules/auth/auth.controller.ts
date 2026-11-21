import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);

    // console.log(result);

    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: false, // in development mode: false, but in production mode it should be true
      httpOnly: true, // to prevent xss attack
      sameSite: "lax", // 'none', 'strict', 'lax' -> CSRF
      // maxAge,
      path: "/",
      domain: "localhost", // omit in dev so it works on both localhost and 127.0.0.1
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const generateToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.generateAccessToken(
      req.cookies.refreshToken,
    );

    // const { refreshToken } = req.cookies;
    // console.log(refreshToken);

    res.status(200).send({
      success: true,
      message: "Access token generated successfully",
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
  generateToken,
};
