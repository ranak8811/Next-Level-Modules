import type { IncomingMessage, ServerResponse } from "http";
import productController from "../controllers/product.controller";

const routeHandler = (req: IncomingMessage, res: ServerResponse) => {
  //   console.log("Request: ", req);
  // console.log("Response: ", res);

  // console.log(req.url);
  // console.log(req.method);

  const url = req.url;
  const method = req.method;

  if (url === "/" && method === "GET") {
    //   console.log("This is root route");

    //   res.writeHead(200, { "Content-Type": "text/plain" });
    res.writeHead(200, { "Content-Type": "application/json" });

    //   res.end("This is root route");
    res.end(JSON.stringify({ message: "This is root route" }));
  } else if (url?.startsWith("/products")) {
    productController(req, res);
  } else {
    //   console.log("No endpoint");

    //   res.writeHead(404, { "Content-Type": "text/plain" });
    res.writeHead(404, { "Content-Type": "application/json" });

    res.end(JSON.stringify({ message: "This root is not defined" }));
  }
};

export default routeHandler;
