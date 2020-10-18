const md5 = require("blueimp-md5");
const UserModel = require("../db/models").UserModel;
const ChatModel = require("../db/models").ChatModel;

var express = require("express");
var router = express.Router();
const filter = { password: 0, _v: 0 }; // 或者'-password -_v' 返回的userdox中不包含password

// 产生一个路由对象，处理/即根路径的get请求
// 请求的结果：渲染一个index.ejs模板，并且给模板传递了一个变量
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
/* 
  我们自己注册的路由都写在这个界面中
*/

// 注册一个路由: 用户注册
/*
a)path为: /register
b)请求方式为: POST
c)接收username和password参数
d)admin是已注册用户
e)注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
f)注册失败返回: {code: 1, msg: '此用户已存在'}
 */
/*
1. 获取请求参数
2. 处理
3. 返回响应数据
 */
/* router.post('/register', function (req, res) {
  console.log('register()')
  // 1. 获取请求参数
  const {username, password} = req.body
  // 2. 处理
  if(username==='admin') { // 注册会失败
    // 返回响应数据(失败)
    res.send({code: 1, msg: '此用户已存在222222'})
  } else { // 注册会成功
    // 返回响应数据(成功)
    res.send({code: 0, data: {id: 'abc123', username, password}})
  }
}) */

// 处理注册请求的路由
router.post("/register", function (req, res) {
  // 获取请求参数
  const { username, password, type } = req.body;
  // 处理
  // 判断用户是否已经存在，存在则不能注册，返回错误信息，不存在则保存注册信息
  UserModel.findOne({ username }, function (err, userdox) {
    // 如果user有值，则存在，不能注册
    if (userdox) {
      // 返回错误信息
      res.send({ code: 1, msg: "用户已经注册" });
    } else {
      // 保存用户信息到数据库并且返回响应信息
      // 密码的保存不能以明文的方式，需要加密
      var userModle = new UserModel({
        username,
        password: md5(password),
        type,
      });
      userModle.save(function (err, userdox) {
        // 生成一个cookie，1000表示1秒钟，1000*60*60*24*7表示7天
        res.cookie("userid", userdox.id, { maxAge: 1000 * 60 * 60 * 24 * 7 }); //
        //返回包含user的json数据
        // 响应数据中不要携带密码，所以自己先封装一个对象
        const data = { username, type, _id: userdox._id };
        res.send({ code: 0, data });
      });
    }
  });
  // 返回响应数据
});

// 登录的路由
router.post("/login", function (req, res) {
  // 获取请求参数
  const { username, password } = req.body;
  // 处理
  // 根据username和password查询，没有则用户不存在，提示错误信息，有则返回登陆成功的信息

  UserModel.findOne({ username, password: md5(password) }, filter, function (
    err,
    userdox
  ) {
    if (userdox) {
      // 登陆成功
      // 生成一个cookie，1000表示1秒钟，1000*60*60*24*7表示7天
      res.cookie("userid", userdox.id, { maxAge: 1000 * 60 * 60 * 24 * 7 });
      // 返回登陆成功的信息
      res.send({ code: 0, data: userdox });
    } else {
      res.send({ code: 1, msg: "用户名或者密码不正确" });
    }
  });
  // 返回响应结果
});

// 更新用户信息：完善信息的路由
router.post("/update", function (req, res) {
  /* 得到提交的用户数据，即是哪一个用户的信息更新
  但是目前在req.body中并没有用户名或者id,无法和数据库中的id进行匹配获取具体是哪一个用户
  需要使用cookie,在用户注册时已经将用户id存放到了浏览器的cookie中
  所以需要在请求的cookie中先得到userid */
  // 从cookie中获取当前注册的用户的id,cookie是一个对象，内容以键值对的形式存在的
  const userid = req.cookies.userid; // cookie中保存的信息会在发请求时自动携带
  // 但是我们可以在浏览器的开发端手动删除当前的cookie信息，所以需要判断一下
  // 如果不存在，则返回一个信息提示结果
  if (!userid) {
    return res.send({ code: 1, msg: "请先登录！" });
  }
  // 存在，则根据userid更新该用户在数据库中的信息
  const user = req.body;
  UserModel.findByIdAndUpdate({ _id: userid }, user, function (err, oldUser) {
    if (!oldUser) {
      // cookie数据被篡改了，和数据库中的id不匹配，需要删除该cookie数据
      res.clearCookie("userid");
      return res.send({ code: 1, msg: "请先登录！" });
    } else {
      // 合并用户的信息，user是新添加的用户信息，oldUser是之前的用户信息
      // assign(Object1,Object2,....)  后面的可能会覆盖掉前面的同名属性
      // 响应的数据中不能包含密码，所以先在oldUser中取出username, type, _id
      const { username, type, _id } = oldUser;
      const data = Object.assign(req.body, { username, type, _id });
      return res.send({ code: 0, data: data });
    }
  });
});

// 获取用户信息的路由
router.get("/user", function (req, res) {
  // 从cookie中获取当前注册的用户的id,cookie是一个对象，内容以键值对的形式存在的
  const userid = req.cookies.userid; // cookie中保存的信息会在发请求时自动携带
  // 但是我们可以在浏览器的开发端手动删除当前的cookie信息，所以需要判断一下
  // 如果不存在，则返回一个信息提示结果
  if (!userid) {
    return res.send({ code: 1, msg: "请先登录！" });
  }
  // 存在，则查询对应的user
  UserModel.findOne({ _id: userid }, filter, function (error, user) {
    if (!user) {
      // cookie数据被篡改了，和数据库中的id不匹配，需要删除该cookie数据
      res.clearCookie("userid");
      return res.send({ code: 1, msg: "请先登录！" });
    } else {
      return res.send({ code: 0, data: user });
    }
  });
});

// 查看用户信息的路由
router.get("/userlist", (req, res) => {
  const { type } = req.query;
  // 得到所有type类型的用户
  UserModel.find({ type: type }, filter, function (err, users) {
    res.send({ code: 0, data: users });
  });
});

// 获取当前用户的聊天消息列表
router.get("/msglist", function (req, res) {
  // 获取cookies中保存的用户的userid
  const userid = req.cookies.userid;
  console.log("userid:", userid);

  // 查询得到所有user的文档数组
  /* 
  users={
    id1:{username,header},
    id2:{username,header},
    ...
  }
  */
  UserModel.find(function (err, userDocs) {
    const users = {};
    userDocs.forEach((doc) => {
      users[doc._id] = { username: doc.username, header: doc.header };
    });

    /* 
    上面的内容等同于
    const users = userDoc.reduce(function(users,doc){
      users[doc._id] = { username: doc.username, header: doc.header };
      return users;
    })
    */

    /* 
  查询userid相关的所有聊天信息:由userid发出的消息或者由userid接收的消息
  */
    ChatModel.find(
      { $or: [{ from: userid }, { to: userid }] },
      filter,
      function (err, chatMsgs) {
        // chatMsgs是数组
        //  返回包含所有用户和当前用户相关的所有聊天消息的数据
        res.send({ code: 0, data: { users, chatMsgs } });
      }
    );
  });
});

/* 修改消息为已读:标记消息已读只能修改别人发给我的消息为已读，我发给别人的需要人家改 */

router.post("/readmsg", function (req, res) {
  // 得到请求中的 from 和 to
  const from = req.body.from; // 给当前登录的用户发消息的用户
  const to = req.cookies.userid; // 当前登录的用户
  /* 
  更新数据库中的chat数据
  */
  ChatModel.update(
    { from, to, read: false }, // 修改的条件：其他人发给当前用户的，并且消息显示未读的
    { read: true }, // 将read属性修改为true
    { multi: true }, // multi为true表示一次更新多条符合条件的信息
    function (err, doc) {
      console.log("/readmsg", doc);
      res.send({ code: 0, data: doc.nModified }); // 返回更新的消息数量
    }
  );
});

module.exports = router;
