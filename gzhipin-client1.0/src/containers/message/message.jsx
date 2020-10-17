/* 消息列表界面的路由组件 */
import React from "react";
import { connect } from "react-redux";

class Message extends React.Component {
  render() {
    return <div>消息列表</div>;
  }
}
export default connect((state) => ({}), {})(Message);
