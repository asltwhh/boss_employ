/* 
    主路由组件
*/

import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Cookies from "js-cookie"; //可以操作前端cookie的对象 set()/remove()
import { NavBar } from "antd-mobile";

import LaobanInfo from "../laoban-info/laoban-info";
import DashenInfo from "../dashen-info/dashen-info";
import { getRedirectTo } from "../../utils";
import { getUser } from "../../redux/actions";
import Dashen from "../dashen/dashen";
import Laoban from "../laoban/laoban";
import Message from "../message/message";
import Personal from "../personal/personal";
import NotFound from "../../components/notfound/notfound";
import NavFooter from "../../components/nav-footer/nav-footer";
import Chat from "../chat/chat";

class Main extends React.Component {
  // 给组件对象添加属性，添加static是给组件类添加属性
  navList = [
    {
      path: "/laoban", // 路由路径
      component: Laoban, // 显示的路由组件
      title: "大神列表", // 顶部的导航栏内容
      icon: "dashen", // 底部显示的图标
      text: "大神", // 图标下的文字
    },
    {
      path: "/dashen",
      component: Dashen,
      title: "老板列表",
      icon: "laoban",
      text: "老板",
    },
    {
      path: "/message",
      component: Message,
      title: "消息列表",
      icon: "message",
      text: "消息",
    },
    {
      path: "/personal",
      component: Personal,
      title: "个人中心",
      icon: "personal",
      text: "个人",
    },
  ];
  componentDidMount() {
    /* 实现异步过程 */
    console.log("componentDidMount()执行啦");

    // (1) 登陆过，但是关掉了该窗口(cookies中有userid)，
    // 之后再打开没有再次登录(redux管理的user中没有_id)
    const userid = Cookies.get("userid");
    const { _id } = this.props.user;
    if (userid && !_id) {
      // 发送异步请求，获取user信息
      // 需要在后台先写请求响应，然后在前台写发送ajax请求的函数、redux等，最后在可以在这里使用
      this.props.getUser();
      // 发送请求后更新了redux中的state，从而使得Main组件接收到的user属性发生了改变，从而重新render()
      // 根据我们在render()中写的内容，此时就会return null
    }
  }

  render() {
    /* (2) cookies中没有userid,则直接重定向到登录界面 */
    // 读取cookies中的userid
    const userid = Cookies.get("userid");
    if (!userid) {
      // 如果没有，则自动重定向到登录界面
      return <Redirect to="/login"></Redirect>;
    }

    /* 
      (3) cookies中有userid 
      判断redux管理的user中是否有_id(有则说明打开浏览器界面时又登录了一次)
    */
    const { user, unReadCount } = this.props;
    /* 
      在这个添加一个debugger,则在第一次渲染界面上就会出现断点
      如果我们之前登陆了，然后关闭了该页面(cookies中有userid)，再次打开访问根路径
          则会自动根据type和header重导向到laobaninfo/daseninfo/laoban/dashen
      然后刷新一下界面，则会出现redux没有使用的状态，这是因为还没有dispatch任何的action
          所以redux还没有使用
      刷新页面之后，会自动pause，此时cookies中有userid,但是user中没有_id
      点击下一步：就会进入return null的步骤
      然后再点击 resume script execution 则会结束第一次render,自动调用componentDidMount,
          发送异步请求，dispatch(action)，然后更新redux,从而更新Main组件中的user,并且再次
          render(),到了debugger这儿再次pause,点击 resume script execution 之后会直接显示
          对应的页面
      
    
    */
    // debugger;
    if (!user._id) {
      // 如果user没有_id,则返回一个null,不做任何显示
      return null;
    } else {
      /* 如果有_id,则显示对应的界面，比如大神界面，老板界面，个人中心界面等 */

      // 获取请求的路径
      let path = this.props.location.pathname;
      // 如果请求的是根路径，就需要根据user的header和type计算得到一个重定向的路径，并且自动重定向
      if (path === "/") {
        path = getRedirectTo(user.type, user.header);
        return <Redirect to={path}></Redirect>;
      }
    }

    // 判断navList中有没有和当前请求的路径相同的路径，有则显示对应的导航栏，否则不显示
    // 因为除了dashen/laoban/message/personal外，其余组件均具备自己的导航栏
    const { navList } = this;
    const path = this.props.location.pathname; //当前请求的路径
    const currentNav = navList.find((nav) => nav.path === path);

    if (currentNav) {
      // 决定哪个路由需要隐藏
      if (user.type === "laoban") {
        // 隐藏数组的第2个
        navList[1].hide = true;
      } else {
        // 隐藏数组的第一个
        navList[0].hide = true;
      }
    }

    return (
      <div>
        {currentNav ? (
          <NavBar className="sticky-header">{currentNav.title}</NavBar>
        ) : null}
        <Switch>
          <Route path="/laobaninfo" component={LaobanInfo}></Route>
          <Route path="/dasheninfo" component={DashenInfo}></Route>
          <Route path="/chat/:userid" component={Chat}></Route>

          {navList.map((nav, index) => (
            <Route
              key={index}
              path={nav.path}
              component={nav.component}
            ></Route>
          ))}
          <Route path="./notfound" component={NotFound}></Route>
        </Switch>
        {currentNav ? (
          <NavFooter navList={navList} unReadCount={unReadCount}></NavFooter>
        ) : null}
      </div>
    );
  }
}

export default connect(
  (state) => ({ user: state.user, unReadCount: state.chat.unReadCount }),
  { getUser }
)(Main);

/* 
1 实现自动登陆：
  在componentDidMount()中实现：
    1) 登陆过，但是关掉了该窗口(cookies中有userid)，之后再打开没有再次登录(redux管理的user中没有_id)，
       发送请求获取对应的用户信息 
  在render()中实现：  
    2) cookies中没有userid(之前没有登录，或者登陆了也注销了) 自动进入login界面
    3) cookies中有userid：判断redux管理的user中是否有_id：
         1：没有暂时不做任何显示(因为我们需要在componentDidMount中发送请求)
         2：有说明当前已经登陆，则显示对应的界面(请求的路径)
          如果请求根路径，会根据user的header和type计算得到一个重定向的路径，
          并且自动重定向
*/
