import type { Request, Response } from "express";
import { userService } from "./user.service.js";

const createUser = async (req: Request, res: Response) => {
  //   console.log(req.body);

  try {
    const result = await userService.createUserIntoDB(req.body);

    res.status(201).send({
      success: true,
      message: "user created",
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

const getAllUsers = async (req: Request, res: Response) => {
  console.log("From contoller: ", req.user);

  try {
    const result = await userService.getAllUsersFromDB();

    // console.log(result);
    res.status(201).send({
      success: true,
      message: "users retrieved",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: error?.message,
      data: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userService.getSingleUserFromDB(id as string);

    // console.log(result);

    if (result.rowCount === 0) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "user retrieved",
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

const updateUser = async (req: Request, res: Response) => {
  //   console.log(req.body);

  try {
    const { id } = req.params;

    const result = await userService.updateUserOnDB(req.body, id as string);

    // console.log(result);

    if (result.rowCount === 0) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "user updated",
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

const deleteUser = async (req: Request, res: Response) => {
  //   console.log(req.body);

  try {
    const { id } = req.params;

    const result = await userService.deleteUserFromDB(id as string);

    // console.log(result);

    if (result.rowCount === 0) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "user deleted",
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: error?.message,
      data: error,
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
