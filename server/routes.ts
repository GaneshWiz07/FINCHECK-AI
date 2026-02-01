import type { Express } from "express";
import type { Server } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { spawn, type ChildProcess } from "child_process";
import path from "path";

let pythonProcess: ChildProcess | null = null;

function startPythonBackend() {
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
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://127.0.0.1:8000/api",
      changeOrigin: true,
      on: {
        error: (err, req, res) => {
          console.error("Proxy error:", err);
          if (!res.headersSent && 'status' in res) {
            (res as any).status(502).json({ 
              error: "Backend service unavailable",
              detail: "Python backend is not responding"
            });
          }
        },
      },
    })
  );

  return httpServer;
}
