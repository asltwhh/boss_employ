import React from "react";
import { connect } from "react-redux";
import { NavBar, List, InputItem } from "antd-mobile";
import { sendMsg } from "../../redux/actions";

const Item = List.Item;

class Chat extends React.Component {
  state = {
    content: "",
  };
  handleSend = () => {
    // 收集数据
    const from = this.props.user._id;
    const to = this.props.match.params.userid;
    const content = this.state.content.trim();
    // 发送请求(发消息)
    if (content) {
      // 异步操作
      this.props.sendMsg({ from, to, content });
    }
    // 清除输入数据
    this.setState({ content: "" });
  };
  render() {
    // debugger;
    // console.log("我又render了一次.....");
    const { user, chat } = this.props;
    const { users, chatMsgs } = chat;
    //当前chatMsgs中包含我和所有其他用户的聊天信息，我现在只需要显示我和某个特定用户的聊天信息
    // 所以需要过滤
    // 先得到当前的chat_id
    const meId = user._id;

    // 刚开始users中是没有数据的，是一个空对象，需要发送异步请求获取消息列表的同时
    // 获取到users
    if (!users[meId]) {
      console.log("我渲染了，但是我还没有得到redux中的状态值");
      return null;
    }

    // debugger;
    const targetId = this.props.match.params.userid;
    const chat_id = [meId, targetId].sort().join("_");

    const msgs = chatMsgs.filter((msg) => msg.chat_id === chat_id);
    // msgs中的消息有两种情况：我发的，对方发的

    console.log(targetId);
    // 获取目标用户的头像
    const targetHeader = users[targetId].header;
    // 有一个问题，对方可能还没有完善信息，并不具备icon
    const targetIcon = targetHeader
      ? require(`../../assets/images/${targetHeader}.png`)
      : null;

    return (
      <div id="chat-page">
        <NavBar>{users[targetId].username}</NavBar>
        <List>
          {msgs.map((msg) => {
            if (msg.to === meId) {
              // 对方发给我的
              return (
                <Item key={msg._id} thumb={targetIcon}>
                  {msg.content}
                </Item>
              );
            } else {
              //我发给对方的
              return (
                <Item key={msg._id} extra="我" className="chat-me">
                  {msg.content}
                </Item>
              );
            }
          })}
        </List>
        <div className="am-tab-bar">
          <InputItem
            placeholder="请输入"
            extra={<span onClick={this.handleSend}>发送</span>}
            value={this.state.content}
            onChange={(val) => this.setState({ content: val })}
          ></InputItem>
        </div>
      </div>
    );
  }
}

export default connect((state) => ({ user: state.user, chat: state.chat }), {
  sendMsg,
})(Chat);
