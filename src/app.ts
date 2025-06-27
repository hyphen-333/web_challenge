import express, { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { Item } from "../models/Item";

//
// — shared in-memory store
//   This Map holds our Item objects keyed by their UUID.
//   In a real app you’d swap this for a database.
//
export const items = new Map<string, Item>();

//
// — handlers
//

/**
 * CREATE handler
 * POST /items
 * Expects `{ name: string, description?: string }` in the request body.
 * Returns 400 if `name` is missing, otherwise creates a new Item (with UUID)
 * and responds with 201 + the new item.
 */
export const createItem = (req: Request, res: Response): void => {
  // pull out name & description from the JSON body
  const { name, description } = req.body as {
    name?: string;
    description?: string;
  };

  // validate required field
  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  // create the new item
  const newItem: Item = { id: uuid(), name, description };
  items.set(newItem.id, newItem);

  // respond with 201 Created + the created item
  res.status(201).json(newItem);
};

/**
 * READ ALL handler
 * GET /items
 * Returns the full array of items (200 OK).
 */
export const getAllItems = (_: Request, res: Response): void => {
  // convert Map values to array
  res.json(Array.from(items.values()));
};

/**
 * UPDATE handler
 * PUT /items/:id
 * Expects partial `{ name?, description? }` in body.
 * Returns 404 if the item doesn’t exist, otherwise merges
 * incoming fields, updates the store, and returns the updated item.
 */
export const updateItem = (req: Request, res: Response): void => {
  const existing = items.get(req.params.id);

  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  // merge old + new, preserving the original id
  const updated: Item = { ...existing, ...(req.body as Partial<Item>) };
  items.set(updated.id, updated);

  // return the updated resource
  res.json(updated);
};

/**
 * DELETE handler
 * DELETE /items/:id
 * Returns 404 if missing, otherwise deletes and returns 204 No Content.
 */
export const deleteItem = (req: Request, res: Response): void => {
  if (!items.has(req.params.id)) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  // remove the item
  items.delete(req.params.id);

  // 204 = success, no response body
  res.sendStatus(204);
};

//
// — wiring into Express
//

// create the Express application
export const app = express();

// built-in JSON parser middleware
app.use(express.json());

// register each CRUD route
app.post("/items", createItem);
app.get("/items", getAllItems);
app.put("/items/:id", updateItem);
app.delete("/items/:id", deleteItem);
