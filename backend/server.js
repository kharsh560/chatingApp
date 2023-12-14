const express = require("express");
const dotenv = require("dotenv");
// const { chats } = require("./data/data");
const connectDB = require("./config/db");
const mongoose = require("mongoose"); //my mongoDB wasn't connecting without this
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

dotenv.config();
const app = express();
connectDB();

app.use(express.json()); //In order to accept json data!

// app.get("/", (req, res) => {
//   res.send(
//     "API is running perfectly and its using nodemon to get automatically updated!"
//   );
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/chatappfrontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname1, "chatappfrontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment-----------------------------

// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });

// app.get("/api/chat/:id", (req, res) => {
//   // console.log(req.params.id);
//   const singleChat = chats.find((c) => c._id === req.params.id);
//   res.send(singleChat);
// });

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5696;

app.listen(PORT, console.log(`The server started on port ${PORT}`));
