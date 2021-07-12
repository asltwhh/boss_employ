const ChatModel = require(`../db/models`).ChatModel;

module.exports = function (server) {
  const io = require("socket.io")(server);

  // 监视客户端与服务器的连接
  io.on("connection", function (socket) {
    console.log("有一个客户端连接到了服务器....");

    // 接收客户端的消息
    socket.on("sendMsg", function ({ from, to, content }) {
      console.log("服务器接收到客户端发送的消息：", { from, to, content });
      // 处理数据（保存消息）
      /* 准备数据
         (目前我们有的消息内容：from,to,content,但是我们的chat模型中还包含chat_id，read,create_time)
         所以需要先准备好数据
      */
      const chat_id = [from, to].sort().join("_"); //from_to或者to_from
      const create_time = Date.now();
      new ChatModel({ from, to, content, chat_id, create_time }).save(function (
        err,
        chatMsg
      ) {
        // 向所有客户端发送消息
        io.emit("receiveMsg", chatMsg);
        console.log("服务器向客户端发送消息", chatMsg);
      });
    });
  });
};
