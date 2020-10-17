/* 
包含n个reducer函数：根据老的state和指定的action返回一个新的state
*/
import { combineReducers } from "redux";

import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
} from "./action-types";
import { getRedirectTo } from "../utils/index";

// 产生user状态的reducer
const initUser = {
  username: "", // 用户名
  type: "", //用户类型
  msg: "", // 存放错误提示信息
  redirectTo: "", //需要自动重定向的路由路径
};
function user(state = initUser, action) {
  switch (action.type) {
    case AUTH_SUCCESS: //data存放user
      console.log(action);
      const { type, header } = action.data;
      return {
        ...state,
        ...action.data,
        redirectTo: getRedirectTo(type, header),
      };
    case ERROR_MSG: // data存放msg，只需要更新msg即可
      return { ...state, msg: action.data };
    case RECEIVE_USER: // 更新成功，则此时action.data中存放的就是所有新的信息
      // 后面还需要添加更新成功后跳转的页面，更新大神信息就去大神主界面，更新老板信息就去老板主界面
      return action.data;
    case RESET_USER: // 用户没有登录成功或者cookie数据被篡改，更新信息失败，则直接将返回msg信息
      // 后面还需要直接跳转到注册界面，因为此用户已经不存在了
      return { ...initUser, msg: action.data };
    default:
      return state;
  }
}

// 产生userlist状态的reducer
const initUserList = [];
function userList(state = initUserList, action) {
  switch (action.type) {
    case RECEIVE_USER_LIST:
      return action.data; // data是userlist
    default:
      return state;
  }
}

// 合并所有的reducer函数，向外暴露
const reducers = combineReducers({
  user,
  userList,
});
// console.log(reducers);

export default reducers;

// 向外暴露的结构：{user:{},userList:{}}
