import path from "path";
import { readFileSync, writeFileSync } from "fs";
import type { IProduct } from "../types/product.type";
const filePath = path.join(process.cwd(), "./src/database/db.json");

export const productService = () => {
  //   console.log(process.cwd());

  const result = readFileSync(filePath, "utf-8");

  // console.log(result.toString());

  return JSON.parse(result);
};

export const createProduct = (payload: IProduct[]) => {
  writeFileSync(filePath, JSON.stringify(payload));
};
