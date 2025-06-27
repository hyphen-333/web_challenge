import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { v4 as uuid } from "uuid";
import { Item } from "./models/Item";

const app = express();
app.use(bodyParser.json());

// in-memory store
const items = new Map<string, Item>();

// — CREATE (POST) —
// POST /items   { name: string, description?: string }
app.post("/items", (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    // just send and exit
    res.status(400).json({ error: "Name is required" });
    return;
  }
  const id = uuid();
  const newItem: Item = { id, name, description };
  items.set(id, newItem);
  res.status(201).json(newItem);
});

// — READ ALL (GET) —
// GET /items

app.get("/items", (_req, res) => {
  res.json(Array.from(items.values()));
});

// — UPDATE (PUT) —
// PUT /items/:id { name?: string, description?: string }

app.put("/items/:id", (req, res): any => {
  const existing = items.get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Not found" });
  }
  const updated: Item = {
    ...existing,
    ...req.body,
    id: existing.id, // keep same ID
  };
  items.set(existing.id, updated);
  res.json(updated);
});

// — DELETE (DELETE) —
// DELETE /items/:id
app.delete("/items/:id", (req, res): any => {
  if (!items.has(req.params.id)) {
    return res.status(404).json({ error: "Not found" });
  }
  items.delete(req.params.id);
  res.status(204).send();
});

app.listen(3000, () => console.log("Listening on 3000"));
