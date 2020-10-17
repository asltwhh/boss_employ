/* 老板主界面路由容器组件 */

import React from "react";
import { connect } from "react-redux";

import UserList from "../../components/userlist/userlist";
import { getUserList } from "../../redux/actions";

class Dashen extends React.Component {
  componentDidMount() {
    // 获取userlist
    this.props.getUserList("laoban");
  }
  render() {
    return (
      <div>
        <UserList userList={this.props.userList}></UserList>
      </div>
    );
  }
}

export default connect((state) => ({ userList: state.userList }), {
  getUserList,
})(Dashen);
