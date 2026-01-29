import { scores, type InsertScore, type Score } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

let db: any = undefined;
try {
  db = require("./db");
} catch {}

export interface IStorage {
  getScores(): Promise<Score[]>;
  createScore(score: InsertScore): Promise<Score>;
}

export class DatabaseStorage implements IStorage {
  async getScores(): Promise<Score[]> {
    return await db.db.select().from(scores).orderBy(scores.score, "desc").limit(10);
  }

  async createScore(insertScore: InsertScore): Promise<Score> {
    const [score] = await db.db.insert(scores).values(insertScore).returning();
    return score;
  }
}

export class MemoryStorage implements IStorage {
  private scores: Score[] = [];
  private id = 1;

  async getScores(): Promise<Score[]> {
    return this.scores.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  async createScore(insertScore: InsertScore): Promise<Score> {
    const score: Score = {
      id: this.id++,
      createdAt: new Date(),
      streak: 0,
      bestStreak: 0,
      coins: 0,
      xp: 0,
      ...insertScore,
    };
    this.scores.push(score);
    return score;
  }
}

// ==================== FILE-BASED PERSISTENT STORAGE ====================
// Stores scores in a JSON file that persists across server restarts

export class FileStorage implements IStorage {
  private scores: Score[] = [];
  private nextId = 1;
  private filePath: string;
  private initialized = false;

  constructor() {
    // Store in the project root directory
    this.filePath = path.join(process.cwd(), "scores-data.json");
    this.loadFromFile();
  }

  private loadFromFile(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, "utf-8");
        const parsed = JSON.parse(data);
        
        // Restore scores with proper Date objects
        this.scores = (parsed.scores || []).map((s: any) => ({
          ...s,
          createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
        }));
        
        this.nextId = parsed.nextId || (this.scores.length > 0 
          ? Math.max(...this.scores.map(s => s.id)) + 1 
          : 1);
        
        console.log(`[FileStorage] Loaded ${this.scores.length} scores from ${this.filePath}`);
      } else {
        console.log(`[FileStorage] No existing data file found, starting fresh`);
        this.scores = [];
        this.nextId = 1;
      }
      this.initialized = true;
    } catch (error) {
      console.error("[FileStorage] Error loading scores:", error);
      this.scores = [];
      this.nextId = 1;
      this.initialized = true;
    }
  }

  private saveToFile(): void {
    try {
      const data = JSON.stringify({
        scores: this.scores,
        nextId: this.nextId,
        lastUpdated: new Date().toISOString(),
      }, null, 2);
      
      fs.writeFileSync(this.filePath, data, "utf-8");
      console.log(`[FileStorage] Saved ${this.scores.length} scores to ${this.filePath}`);
    } catch (error) {
      console.error("[FileStorage] Error saving scores:", error);
    }
  }

  async getScores(): Promise<Score[]> {
    // Return top 50 scores (more than before for better leaderboard)
    return this.scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  }

  async createScore(insertScore: InsertScore): Promise<Score> {
    const score: Score = {
      id: this.nextId++,
      playerName: insertScore.playerName,
      score: insertScore.score,
      tier: insertScore.tier,
      passiveIncome: insertScore.passiveIncome ?? 0,
      streak: insertScore.streak ?? 0,
      bestStreak: insertScore.bestStreak ?? 0,
      coins: insertScore.coins ?? 0,
      xp: insertScore.xp ?? 0,
      createdAt: new Date(),
    };
    
    this.scores.push(score);
    
    // Save to file immediately for persistence
    this.saveToFile();
    
    return score;
  }

  // Get all scores (for admin purposes)
  async getAllScores(): Promise<Score[]> {
    return this.scores.sort((a, b) => b.score - a.score);
  }

  // Clear all scores (for testing)
  async clearScores(): Promise<void> {
    this.scores = [];
    this.nextId = 1;
    this.saveToFile();
  }
}

// ==================== STORAGE SELECTION ====================
// Priority: Database > File Storage
// File storage is used by default (no setup required, persistent)

function createStorage(): IStorage {
  if (process.env.DATABASE_URL) {
    console.log("[Storage] Using DatabaseStorage (PostgreSQL)");
    return new DatabaseStorage();
  }
  
  // Default to FileStorage for persistence without database
  console.log("[Storage] Using FileStorage (JSON file persistence)");
  return new FileStorage();
}

export const storage = createStorage();
