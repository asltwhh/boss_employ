/* 
大神信息完善的路由容器组件
*/

import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { NavBar, InputItem, TextareaItem, Button } from "antd-mobile";

import HeaderSelector from "../../components/header-selector/header-selector";
import { updateUser } from "../../redux/actions";

class DashenInfo extends React.Component {
  state = {
    header: "", // string:"头像1，头像2..."
    post: "", // 职位
    info: "", // 信息
  };
  // 更新header状态
  setHeader = (header) => {
    this.setState({ header: header });
  };
  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };
  save = () => {
    this.props.updateUser(this.state);
  };
  render() {
    const { header, type } = this.props.user;
    if (header) {
      // 判断如果信息已经完善，判断type，自动重定向到响应的界面，虽然目前我们还没有定义老板主界面和大神主界面
      const path = type === "dashen" ? "/dashen" : "/laoban";
      return <Redirect to={path}></Redirect>;
    }
    return (
      <div>
        <NavBar>大神信息完善</NavBar>
        <HeaderSelector setHeader={this.setHeader}></HeaderSelector>
        <InputItem
          placeholder="请输入理想职位"
          onChange={(value) => {
            this.handleChange("post", value);
          }}
        >
          应聘职位：
        </InputItem>
        <TextareaItem
          title="个人介绍："
          rows={3}
          placeholder="请简单介绍自己"
          onChange={(value) => {
            this.handleChange("info", value);
          }}
        />
        <Button type="primary" onClick={this.save}>
          保&nbsp;&nbsp;&nbsp;存
        </Button>
      </div>
    );
  }
}

export default connect((state) => ({ user: state.user }), { updateUser })(
  DashenInfo
);
