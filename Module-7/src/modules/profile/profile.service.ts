import { pool } from "../../db/index.js";

const createProfileIntoDB = async (payload: any) => {
  const { user_id, bio, address, phone, gender } = payload;

  const user = await pool.query(
    `
      Select * from users where id = $1
    `,
    [user_id],
  );

  if (user.rowCount === 0) {
    throw new Error("User doesn't exist in the db");
  }

  const result = await pool.query(
    `
            Insert into profile (user_id, bio, address, phone, gender) 
            values
            ($1, $2, $3, $4, $5)
            returning *
        `,
    [user_id, bio, address, phone, gender],
  );

  return result;
};

export const profileService = {
  createProfileIntoDB,
};
