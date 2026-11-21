import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = async (req: Request, res: Response, next: NextFunction) => {
  const log = `Method: ${req.method} | Url: ${req.url} | Time: ${new Date().toISOString()}\n`;

  fs.appendFile("logger.txt", log, (err) => {
    if (err) {
      console.error("Failed to write to logger.txt:", err);
    }
  });

  next();
};

export default logger;
