import { app } from "./src/app";

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}
