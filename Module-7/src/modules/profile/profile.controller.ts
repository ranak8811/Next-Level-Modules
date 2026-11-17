import type { Request, Response } from "express";
import { profileService } from "./profile.service.js";

const createProfile = async (req: Request, res: Response) => {
  try {
    const result = await profileService.createProfileIntoDB(req.body);

    res.status(201).send({
      success: true,
      message: "Profile created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: error?.message,
      data: error,
    });
  }
};

export const profileController = {
  createProfile,
};
