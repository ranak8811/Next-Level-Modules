import { pool } from "../../db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
  };

  const generateAccessToken = jwt.sign(jwtPayload, "hey--yyoou-boyy", {
    expiresIn: "1d",
  });
  delete user.rows[0].password;
  return { generateAccessToken, user: user.rows[0] };
};

export const authService = {
  loginUser,
};
