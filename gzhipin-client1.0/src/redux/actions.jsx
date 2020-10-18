/* 
包含多个action creators
    异步action
    同步action
*/
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList,
  reqReadMsg,
} from "../api";
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_Msg_LIST,
  RECEIVE_Msg,
} from "./action-types";

import io from "socket.io-client";

/* 
单例对象：整个内存中仅有一个socket
   1 创建对象之前：判断对象是否已经创建，只有当不存在时才创建
   2 创建对象之后：保存socket对象在io对象中
*/
// 接收到一个消息的同步action
const receiveMsg = (chatMsg) => ({
  type: RECEIVE_Msg,
  data: chatMsg,
});

function initIO(userid, dispatch) {
  if (!io.socket) {
    // 连接服务器,得到与服务器的连接对象 ws是协议，类似于http
    io.socket = io("ws://localhost:4000");

    // 接收来自服务器端的消息
    io.socket.on("receiveMsg", function (chatMsg) {
      console.log("接收来自服务器端的消息：", chatMsg);
      // 只有当chatMsg是与当前用户相关的消息，才去分发同步action保存
      if (userid === chatMsg.from || userid === chatMsg.to) {
        dispatch(receiveMsg(chatMsg));
      }
    });
  }
}

// 异步获取消息列表数据
async function getMsgList(userid, dispatch) {
  initIO(userid, dispatch);
  const response = await reqChatMsgList();
  const result = response.data;
  if (result.code === 0) {
    const { users, chatMsgs } = result.data;
    // 分发同步action
    dispatch(receiveMsgList({ users, chatMsgs }));
  }
}

// 发送消息的异步action
export const sendMsg = ({ from, to, content }) => {
  return (dispatch) => {
    console.log("客户端向服务器发送消息", { from, to, content });
    // 发送消息用的是socket.io
    // 发消息
    io.socket.emit("sendMsg", { from, to, content });
  };
};

// 授权成功的同步action
const authSuccess = (user) => ({ type: AUTH_SUCCESS, data: user });
// 错误提示信息的同步action
const errorMsg = (msg) => ({ type: ERROR_MSG, data: msg });
// 接收用户信息的同步action
const receiveUser = (user) => ({ type: RECEIVE_USER, data: user });
// 重置用户信息的同步action
export const resetUser = (msg) => ({ type: RESET_USER, data: msg });
// 接收消息列表的同步action
const receiveMsgList = ({ users, chatMsgs }) => ({
  type: RECEIVE_Msg_LIST,
  data: { users, chatMsgs },
});

// 获取用户列表的同步action
const receiveUserList = (userList) => ({
  type: RECEIVE_USER_LIST,
  data: userList,
});

// 注册异步action
export const register = (user) => {
  const { username, password, password2, type } = user;

  // 做表单的前台验证
  if (!username) {
    return errorMsg("用户名不能为空");
  } else if (password !== password2) {
    return errorMsg("两次输入密码不一致");
  }

  //表单数据合法，返回一个发ajax请求的异步action函数
  return async (dispatch) => {
    // 发送注册的异步请求   使用await可以直接获取到response，不使用await得到的是promise对象
    // 还需要再then再得到response
    // 但是一旦某个语句使用了await,就需要在其前面添加async
    /* 
        const promise = reqRegister(user);
        promise.then(response => {
            const result = response.data;  {code:0/1,data:user,msg:''}
        })
        */
    const response = await reqRegister({ username, password, type });
    const result = response.data;
    if (result.code === 0) {
      // 获取当前用户的id
      const userid = result.data._id;
      getMsgList(userid, dispatch);
      // 成功,分发授权成功的同步action
      dispatch(authSuccess(result.data));
    } else {
      // 失败,分发提示错误信息的同步action
      dispatch(errorMsg(result.msg));
    }
  };
};

// 登录异步action
export const login = (user) => {
  const { username, password } = user;
  // 做表单的前台验证
  if (!username) {
    return errorMsg("用户名不能为空");
  } else if (!password) {
    return errorMsg("密码不能为空");
  }

  return async (dispatch) => {
    // 发送注册的异步请求   使用await可以直接获取到response，不使用await得到的是promise对象
    // 还需要再then再得到response
    // 但是一旦某个语句使用了await,就需要在其前面添加async
    /* 
        const promise = reqRegister(user);
        promise.then(response => {
            const result = response.data;  {code:0/1,data:user,msg:''}
        })
        */
    const response = await reqLogin({ username, password });
    const result = response.data;
    if (result.code === 0) {
      // 获取当前用户的id
      const userid = result.data._id;
      getMsgList(userid, dispatch);
      // 成功,分发授权成功的同步action
      dispatch(authSuccess(result.data));
    } else {
      // 失败,分发提示错误信息的同步action
      dispatch(errorMsg(result.msg));
    }
  };
};

// 异步更新数据
export const updateUser = (user) => {
  return async (dispatch) => {
    const response = await reqUpdateUser(user);
    console.log(response);
    const result = response.data; // result：{code:0,data} {code:1,msg}
    if (result.code === 0) {
      // 分发同步action
      // 更新成功，保存,data中存放的是用户的用户名，id,type,post,salary,company等信息
      dispatch(receiveUser(result.data));
    } else {
      // 没有登录或者cookie的信息被篡改了，则会报出错误信息：请先登录
      dispatch(resetUser(result.msg));
    }
  };
};

// 获取用户异步action
export const getUser = () => {
  return async (dispatch) => {
    // 执行异步ajax请求
    const response = await reqUser();
    const result = response.data;
    if (result.code === 0) {
      // 获取当前用户的id
      const userid = result.data._id;
      getMsgList(userid, dispatch);
      dispatch(receiveUser(result.data));
    } else {
      dispatch(resetUser(result.msg));
    }
  };
};

// 获取用户列表的异步action
export const getUserList = (type) => {
  return async (dispatch) => {
    // 执行异步ajax请求
    const response = await reqUserList(type);
    const result = response.data;
    // 分发一个同步action
    if (result.code === 0) {
      dispatch(receiveUserList(result.data));
    }
  };
};
