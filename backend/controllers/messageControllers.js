const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  // required stuffs to send a message? :-
  // 1) on which chat to send the message
  // 2)message itself
  // 3)Sender of the message

  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  } //Did validation check:- if content or chat-id doesn't exist, we send error
  // otherwise we send a new message like this:-

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  }; //those three required things

  //   Now inside try-catch, we are goanna query our database:-
  try {
    var message = await Message.create(newMessage); //this "newmessage" has all of those three stuffs
    message = await message.populate("sender", "name pic"); //we used "execPopulate" as (.execPopulate();) because we are populating the instance of the mongoose class, but now its deprecated
    message = await message.populate("chat");
    message = await User.populate(message, {
      //inside this curly braces we write what things are we goanna populate
      path: "chat.users",
      select: "name pic email",
    });

    // finally we are goanna find by id and update the chat with the latest message!!
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };

// const asyncHandler = require("express-async-handler");
// const Message = require("../models/messageModel");
// const User = require("../models/userModel");
// const Chat = require("../models/chatModel");

// //@description     Get all Messages
// //@route           GET /api/Message/:chatId
// //@access          Protected
// const allMessages = asyncHandler(async (req, res) => {
//   try {
//     const messages = await Message.find({ chat: req.params.chatId })
//       .populate("sender", "name pic email")
//       .populate("chat");
//     res.json(messages);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });

// //@description     Create New Message
// //@route           POST /api/Message/
// //@access          Protected
// const sendMessage = asyncHandler(async (req, res) => {
//   const { content, chatId } = req.body;

//   if (!content || !chatId) {
//     console.log("Invalid data passed into request");
//     return res.sendStatus(400);
//   }

//   var newMessage = {
//     sender: req.user._id,
//     content: content,
//     chat: chatId,
//   };

//   try {
//     var message = await Message.create(newMessage);

//     message = await message.populate("sender", "name pic").execPopulate();
//     message = await message.populate("chat").execPopulate();
//     message = await User.populate(message, {
//       path: "chat.users",
//       select: "name pic email",
//     });

//     await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

//     res.json(message);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });

// module.exports = { allMessages, sendMessage };
