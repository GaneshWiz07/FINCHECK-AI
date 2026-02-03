import type { Express } from "express";
import type { Server } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { spawn, type ChildProcess } from "child_process";
import path from "path";

let pythonProcess: ChildProcess | null = null;

// Backend URL - in Docker, use service name; locally use 127.0.0.1
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";
const IS_DOCKER = process.env.IS_DOCKER === "true";

function startPythonBackend() {
  // Skip spawning Python if running in Docker (backend is a separate container)
  if (IS_DOCKER) {
    console.log("Running in Docker - backend is a separate container");
    return;
  }

  const backendDir = path.resolve(import.meta.dirname, "..", "backend");

  console.log("Starting Python backend...");

  pythonProcess = spawn("python", ["-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"], {
    cwd: backendDir,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      PYTHONUNBUFFERED: "1"
    }
  });

  pythonProcess.stdout?.on("data", (data) => {
    console.log(`[Python] ${data.toString().trim()}`);
  });

  pythonProcess.stderr?.on("data", (data) => {
    console.error(`[Python] ${data.toString().trim()}`);
  });

  pythonProcess.on("error", (err) => {
    console.error("Failed to start Python backend:", err);
  });

  pythonProcess.on("exit", (code, signal) => {
    console.log(`Python backend exited with code ${code}, signal ${signal}`);
    if (code !== 0 && code !== null) {
      setTimeout(startPythonBackend, 5000);
    }
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  startPythonBackend();

  // Wait for backend to start (skip in Docker as backend starts independently)
  if (!IS_DOCKER) {
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  app.use(
    "/api",
    createProxyMiddleware({
      target: BACKEND_URL,
      changeOrigin: true,
      pathRewrite: (path) => {
        const newPath = `/api${path}`;
        console.log(`[Proxy] Rewriting path: ${path} -> ${newPath}`);
        return newPath;
      },
      on: {
        proxyReq: (proxyReq, req) => {
          console.log(`[Proxy] Forwarding ${req.method} ${req.url} to ${BACKEND_URL}`);
        },
        proxyRes: (proxyRes, req) => {
          console.log(`[Proxy] Response from backend: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
        },
        error: (err, req, res) => {
          console.error("[Proxy] Error:", err.message);
          // Type guard: check if res is a ServerResponse (not a Socket)
          if (res && "writeHead" in res && typeof res.writeHead === "function") {
            const serverRes = res as import("http").ServerResponse;
            if (!serverRes.headersSent) {
              serverRes.writeHead(502, { "Content-Type": "application/json" });
              serverRes.end(
                JSON.stringify({
                  error: "Backend service unavailable",
                  detail: err.message,
                })
              );
            }
          }
        },
      },
    })
  );

  return httpServer;
}
