import "dotenv/config";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { Pool } from "pg";
import config from "./config/index.js";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// const port = 3000;

const pool = new Pool({
  connectionString: config.connection_string,
});

// console.log(pool);

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      age INT,
      is_Active BOOLEAN DEFAULT true,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      );
      `);
    console.log("Database connected!!");
  } catch (error) {
    console.log(error);
  }
};

initDB();

app.get("/", (req: Request, res: Response) => {
  //   res.send("Hello World!");
  //   console.log(req);
  res.status(200).send("hey ok");
});

app.post("/api/v1/users", async (req: Request, res: Response) => {
  //   console.log(req.body);

  const { name, email, password, age } = req.body;

  try {
    const result = await pool.query(
      `
  INSERT INTO users (name,email,password,age) VALUES
  ($1,$2,$3,$4) RETURNING *
    `,
      [name, email, password, age],
    );

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
});

app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      Select * from users
    `);

    console.log(result);
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
});

app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      Select * from users where id = $1
    `,
      [id],
    );

    console.log(result);

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
});

app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
  //   console.log(req.body);

  try {
    const { id } = req.params;
    const { name, age, password, is_Active } = req.body;
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

    console.log(result);

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
});

app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
  //   console.log(req.body);

  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      Delete from users 
      where id = $1
    `,
      [id],
    );

    console.log(result);

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
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
