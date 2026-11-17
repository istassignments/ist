const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const publicDirectory = path.resolve(__dirname, "www");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(message);
}

const server = http.createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    sendText(response, 405, "Method Not Allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    sendText(response, 400, "Bad Request");
    return;
  }

  if (pathname.includes("\0")) {
    sendText(response, 400, "Bad Request");
    return;
  }

  const requestedPath = path.resolve(publicDirectory, `.${pathname}`);
  const relativePath = path.relative(publicDirectory, requestedPath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  try {
    let filePath = requestedPath;
    let fileInfo = await fs.promises.stat(filePath);

    if (fileInfo.isDirectory()) {
      filePath = path.join(filePath, "index.html");
      fileInfo = await fs.promises.stat(filePath);
    }

    if (!fileInfo.isFile()) {
      sendText(response, 404, "Not Found");
      return;
    }

    response.writeHead(200, {
      "Content-Length": fileInfo.size,
      "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on("error", (error) => {
      console.error(`Unable to serve ${filePath}:`, error);
      if (!response.headersSent) {
        sendText(response, 500, "Internal Server Error");
      } else {
        response.destroy(error);
      }
    });
    stream.pipe(response);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") {
      sendText(response, 404, "Not Found");
      return;
    }

    console.error(`Unable to serve ${pathname}:`, error);
    sendText(response, 500, "Internal Server Error");
  }
});

const port = Number.parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "0.0.0.0";

server.listen(port, host, () => {
  console.log(`Fashion shop is running at http://localhost:${port}`);
});