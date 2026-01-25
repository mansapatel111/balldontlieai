import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerCommentaryRoutes } from "./commentary-routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Register commentary routes
  registerCommentaryRoutes(app);

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return httpServer;
}
