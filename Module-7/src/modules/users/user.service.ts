import { pool } from "../../db/index.js";
import type { IUpdateUser, IUser } from "./user.interface.js";
import bcrypt from "bcryptjs";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, age, role } = payload;

  const hashPass = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
  INSERT INTO users (name,email,password,age,role) VALUES
  ($1,$2,$3,$4,coalesce($5, 'user')) RETURNING *
    `,
    [name, email, hashPass, age, role],
  );

  delete result.rows[0].password;
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(`
      Select * from users
    `);

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
      Select * from users where id = $1
    `,
    [id],
  );

  return result;
};

const updateUserOnDB = async (paylod: Partial<IUpdateUser>, id: string) => {
  const { name, age, password, is_Active } = paylod;
  const result = await pool.query(
    `
      Update users 
      set 
      name = coalesce($1, name),
      password = coalesce($2, password),
      age = coalesce($3, age),
      is_Active = coalesce($4, is_Active),
      updated_at = now()
      where id = $5
      Returning *
    `,
    [name ?? null, password ?? null, age ?? null, is_Active ?? null, id],
  );

  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
      Delete from users 
      where id = $1
    `,
    [id],
  );

  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserOnDB,
  deleteUserFromDB,
};
