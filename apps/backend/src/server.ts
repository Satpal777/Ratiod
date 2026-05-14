import { createServer } from "node:http";
import createApp from "./app";
import { createSocketServer } from "./sockets";

const port = Number(process.env.PORT ?? 3000);
const app = createApp();
const httpServer = createServer(app);

createSocketServer(httpServer);

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
