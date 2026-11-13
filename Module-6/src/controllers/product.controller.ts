import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../services/product.service";
import type { IProduct } from "../types/product.type";
import { bodyParser } from "../utils/parseBody";
import { sendResponse } from "../utils/sendResponse";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  const urlParams = url?.split("/");

  const id =
    urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null;

  // console.log(id);

  if (url === "/products" && method === "GET") {
    const products = productService();

    try {
      sendResponse(res, true, 200, "Product retrieved successfully", products);
    } catch (error) {
      sendResponse(res, false, 500, "Internal server error");
    }
  } else if (method === "GET" && id !== null) {
    const products = productService();

    const product = products.find((p: IProduct) => p.id === id);

    try {
      if (!product) {
        return sendResponse(
          res,
          true,
          200,
          "Product retrieved successfully",
          product,
        );
      }
    } catch (error) {
      sendResponse(res, false, 500, "Internal server error");
    }

    res.writeHead(200, { "Content-Type": "application/json" });

    res.end(
      JSON.stringify({
        message: "Product retrieved successfully",
        data: product,
      }),
    );
  } else if (method === "POST" && url === "/products") {
    const body = await bodyParser(req);

    // console.log(JSON.parse(body));

    const newProduct = {
      id: Date.now(),
      ...body,
    };

    // console.log(newProduct);

    const products = productService();

    products.push(newProduct);

    createProduct(products);

    res.writeHead(201, { "Content-Type": "application/json" });

    res.end(
      JSON.stringify({
        message: "Product created successfully",
        data: newProduct,
      }),
    );
  } else if (method === "PUT" && id !== null) {
    const body = await bodyParser(req);

    const products = productService();

    const index = products.findIndex((p: IProduct) => p.id === id);

    // console.log(index);

    if (index < 0) {
      res.writeHead(201, { "Content-Type": "application/json" });

      res.end(
        JSON.stringify({
          message: "Product not found",
          // data: newProduct,
        }),
      );
    }

    // console.log(products[index]);

    products[index] = { id: products[index].id, ...body };

    createProduct(products);

    res.writeHead(200, { "Content-Type": "application/json" });

    res.end(
      JSON.stringify({
        message: "Product updated successfully",
        data: products[index],
      }),
    );
  } else if (method === "DELETE" && id !== null) {
    const products = productService();

    const index = products.findIndex((p: IProduct) => p.id === id);

    if (index < 0) {
      res.writeHead(201, { "Content-Type": "application/json" });

      res.end(
        JSON.stringify({
          message: "Product not found",
        }),
      );
    }

    products.splice(index, 1);
    createProduct(products);

    res.writeHead(200, { "Content-Type": "application/json" });

    res.end(
      JSON.stringify({
        message: "Product deleted successfully",
        data: products[index],
      }),
    );
  }
};

export default productController;
