# web_challenge

This project is test project

## 1.Express + built-in JSON parser

###

    I chose Express because it’s the de-facto minimal, unopinionated framework for Node.js REST APIs. By using app.use(express.json()) (instead of the older body-parser package) you get lightweight, zero-config JSON parsing out of the box.

## 2.In-memory Map store

###

    For a simple demo, spinning up a real database adds noise. A Map<string,Item> lets us focus purely on the shape of our CRUD endpoints without boilerplate—each entry’s key is its id, which makes lookups/updates/deletes O(1).

## 3. Strongly-typed DTOs & RequestHandler generics

###

    Defining CreateItemDto and UpdateItemDto makes it crystal-clear what shape of data each route expects.

    Using RequestHandler<Params,ResBody,ReqBody> guarantees at compile time that, for example, req.body has a name on POST or that req.params.id is always a string. No more any!

## 4.Named handler functions

###

    Pulling each CRUD operation into its own constant (createItem, getAllItems, etc.) improves readability and makes it trivial to unit-test each piece in isolation.

## 5.RESTful conventions & HTTP status codes

###

    - POST /items → 201 (Created)

    - GET /items → 200 (OK)

    - GET /items/:id → 404 if missing

    - PUT /items/:id → 200 with updated resource

    - DELETE /items/:id → 204 (No Content)

    Sticking to these standard codes and verb/URL pairings makes the API predictable for any client.

## 6. Global error middleware

###

    A catch-all ErrorRequestHandler at the bottom ensures any uncaught exception is turned into a 500 Internal Server Error JSON response, keeping our surface area consistent.
