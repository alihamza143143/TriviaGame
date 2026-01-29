import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get(api.scores.list.path, async (req, res) => {
    const scores = await storage.getScores();
    res.json(scores);
  });

  app.post(api.scores.create.path, async (req, res) => {
    try {
      const input = api.scores.create.input.parse(req.body);
      const score = await storage.createScore(input);
      res.status(201).json(score);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed data
  const existingScores = await storage.getScores();
  if (existingScores.length === 0) {
    await storage.createScore({ playerName: "MoneyMaster", score: 450, tier: "adults", passiveIncome: 250 });
    await storage.createScore({ playerName: "SaverKid", score: 320, tier: "kids", passiveIncome: 180 });
    await storage.createScore({ playerName: "TeenTycoon", score: 380, tier: "teens", passiveIncome: 210 });
  }

  return httpServer;
}
