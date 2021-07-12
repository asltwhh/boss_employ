/* // 测试代码：
module.exports = function (server) {
  // 先引入socket.io这个库，得到一个函数，以server为参数，表示挂在这个服务器上，得到了一个IO对象
  const io = require("socket.io")(server);

  // 监视连接 当有任何一个客户端连接上服务器时运行回调
  io.on("connection", function (socket) {
    console.log("socketio connected");

    // 绑定sendMsg监听，接收客户端发送的消息
    socket.on("sendMsg", function (data) {
      console.log("服务器接收到浏览器的消息", data);

      // 向客户端发送消息(名称，数据)
      io.emit("receiveMsg", data.name + "_" + data.date); // io是全局对象，发送给所有连接上服务器的客户端
      // socket.emit("receiveMsg", data.name + "_" + data.date); // socket是局部对象，发送给当前socket对应的客户端，只有一个
      console.log("服务器向浏览器发送消息", data);
    });
  });
}; */

module.exports = function (server) {
  const io = require("socket.io")(server);

  // 监视客户端与服务器的连接
  io.on("connection", function (socket) {
    console.log("有一个客户端连接到了服务器....");

    // 接收客户端的消息
    socket.on("sendMsg", function (data) {
      console.log("服务器接收到客户端发送的消息：", data);
      // 处理接收到数据
      data.name = data.name.toUpperCase();

      // 服务器向客户端发送消息
      socket.emit("receiveMsg", data);
      console.log("服务器向客户端发送消息", data);
    });
  });
};
