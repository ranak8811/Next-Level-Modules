import { pool } from "../../db/index.js";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config/index.js";

const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const user = await pool.query(
    `
      Select * from users where email = $1
    `,
    [email],
  );

  //   console.log(user.rows[0]);

  if (user.rowCount === 0) {
    throw new Error("Invalid credentials");
  }

  const matchPass = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPass) {
    throw new Error("Invalid credentials");
  }

  if (!user.rows[0].is_active) {
    throw new Error("Access denied");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(jwtPayload, config.refresh_secret, {
    expiresIn: "10d",
  });

  delete user.rows[0].password;

  return { accessToken, refreshToken, user: user.rows[0] };
};

const generateAccessToken = async (token: string) => {
  if (!token) {
    throw new Error("Unautorized access");
  }

  const decode = jwt.verify(
    token as string,
    config.refresh_secret,
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
    throw new Error("User not found");
  }

  if (!user.rows[0].is_active) {
    throw new Error("User Forbidden");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1h",
  });

  return { accessToken };
};

export const authService = {
  loginUser,
  generateAccessToken,
};
