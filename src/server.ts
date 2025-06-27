import { app } from "./app";

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}
