const express = require("express");
const { createServer } = require("http");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const cors = require("cors");
const socketService = require("./services/socket");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

connectDB();
const app = express();
const httpServer = createServer(app);

app.use(cors());

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5001;

httpServer.listen(port, () =>
  console.log(`[server]: Server is running on http://localhost:${port}`)
);

socketService(httpServer);
