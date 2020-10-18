/* 
包含n个action-type名称常量
*/

// 操作user状态

export const AUTH_SUCCESS = "auth_success"; //注册或者登陆成功的action-type
export const ERROR_MSG = "error_msg";

export const RECEIVE_USER = "receive_user"; // 接收用户信息
export const RESET_USER = "reset_user"; // 重置用户信息

// 操作userlist状态
export const RECEIVE_USER_LIST = "receive_user_list"; // 接收用户列表

// 获取用户的消息列表   与当前登录用户相关的所有消息
export const RECEIVE_Msg_LIST = "receive_msg_list";
// 接收到一条消息
export const RECEIVE_Msg = "receive_msg";
