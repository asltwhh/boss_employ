// 入口js文件
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import Register from "./containers/register/register";
import Login from "./containers/login/login";
import Main from "./containers/main/main";
import store from "./redux/store";

import "./assets/css/index.less";
// import "./test/socketio_test";

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route path="/register" component={Register}></Route>
        <Route path="/login" component={Login}></Route>
        {/* 除了path是上面两个外，其余路径均会显示Main组件 */}
        <Route component={Main}></Route>
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
