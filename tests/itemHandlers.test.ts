import { Request, Response } from "express";
import {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
  items,
} from "../src/app";

/**
 * Test suite for our CRUD handlers, organized by HTTP action.
 * We follow the AAA (Arrange–Act–Assert) pattern in every test.
 */
describe("CRUD Handlers (AAA pattern)", () => {
  /**
   * Before each test, clear the shared in-memory store
   * so tests don’t leak state into one another.
   */
  beforeEach(() => {
    items.clear();
  });

  /**
   * CREATE tests: POST /items
   */
  describe("createItem", () => {
    it("missing name → should respond 400 and not change the store", () => {
      // Arrange: build a fake req/res pair with no body.name
      const req = { body: {} } as Request;
      const json = jest.fn();
      const res = {
        status: jest.fn().mockReturnValue({ json }),
      } as unknown as Response;

      // Act: call our handler
      createItem(req, res);

      // Assert: ensure we returned 400, and nothing was added
      expect(res.status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: "Name is required" });
      expect(items.size).toBe(0);
    });

    it("valid body → should respond 201 and store the new item", () => {
      // Arrange: a well-formed request body
      const body = { name: "Test", description: "Desc" };
      const req = { body } as Request;
      const json = jest.fn();
      const res = {
        status: jest.fn().mockReturnValue({ json }),
      } as unknown as Response;

      // Act: invoke handler
      createItem(req, res);

      // Assert: status 201, response contains our data, and store size is 1
      expect(res.status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ ...body }));
      expect(items.size).toBe(1);
    });
  });

  /**
   * READ ALL tests: GET /items
   */
  describe("getAllItems", () => {
    it("empty store → should respond with an empty array", () => {
      // Arrange: no items in store
      const json = jest.fn();
      const res = { json } as unknown as Response;

      // Act
      getAllItems({} as Request, res);

      // Assert
      expect(json).toHaveBeenCalledWith([]);
    });

    it("non-empty store → should return all items", () => {
      // Arrange: populate store with two items
      items.set("a", { id: "a", name: "A" });
      items.set("b", { id: "b", name: "B" });
      const json = jest.fn();
      const res = { json } as unknown as Response;

      // Act
      getAllItems({} as Request, res);

      // Assert: we get an array containing both items
      expect(json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: "a", name: "A" }),
          expect.objectContaining({ id: "b", name: "B" }),
        ])
      );
    });
  });

  /**
   * UPDATE tests: PUT /items/:id
   */
  describe("updateItem", () => {
    it("item not found → should respond 404", () => {
      // Arrange: no such key in store
      const req = { params: { id: "x" }, body: {} } as unknown as Request;
      const json = jest.fn();
      const res = {
        status: jest.fn().mockReturnValue({ json }),
      } as unknown as Response;

      // Act
      updateItem(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ error: "Not found" });
    });

    it("item exists → should merge changes and return updated item", () => {
      // Arrange: seed store, then update only name
      items.set("1", { id: "1", name: "Old", description: "D" });
      const req = {
        params: { id: "1" },
        body: { name: "New" },
      } as unknown as Request;
      const json = jest.fn();
      const res = { json } as unknown as Response;

      // Act
      updateItem(req, res);

      // Assert: JSON reflects merged fields, and store was updated
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({ id: "1", name: "New", description: "D" })
      );
      expect(items.get("1")!.name).toBe("New");
    });
  });

  /**
   * DELETE tests: DELETE /items/:id
   */
  describe("deleteItem", () => {
    it("item not found → should respond 404", () => {
      // Arrange: empty store
      const req = { params: { id: "z" } } as unknown as Request;
      const json = jest.fn();
      const res = {
        status: jest.fn().mockReturnValue({ json }),
      } as unknown as Response;

      // Act
      deleteItem(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ error: "Not found" });
    });

    it("item exists → should delete and respond 204", () => {
      // Arrange: add an item, prepare sendStatus mock
      items.set("9", { id: "9", name: "X" });
      const req = { params: { id: "9" } } as unknown as Request;
      const sendStatus = jest.fn();
      const res = { sendStatus } as unknown as Response;

      // Act
      deleteItem(req, res);

      // Assert: 204 status and store no longer has the key
      expect(sendStatus).toHaveBeenCalledWith(204);
      expect(items.has("9")).toBe(false);
    });
  });
});
