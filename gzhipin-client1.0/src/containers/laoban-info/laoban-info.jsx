/* 
老板信息完善的路由容器组件
*/

import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { NavBar, InputItem, TextareaItem, Button } from "antd-mobile";

import HeaderSelector from "../../components/header-selector/header-selector";

import { updateUser } from "../../redux/actions";

class LaobanInfo extends React.Component {
  state = {
    header: "", // 头像
    post: "", // 职位
    info: "", // 信息
    company: "", // 公司名称
    salary: "", // 薪资
  };
  // 更新header状态
  setHeader = (header) => {
    this.setState({ header: header });
  };
  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };
  save = () => {
    // 传入的就是需要更新的信息，这些信息我们通过受控组件的方式已经保存在了this.state中
    this.props.updateUser(this.state);
  };
  render() {
    const { header, type } = this.props.user;
    if (header) {
      // 说明信息已经得到了完善，需要重定向到一个特定的路径
      // 判断类型决定是跳转到老板界面还是大神界面
      const path = type === "dashen" ? "/dashen" : "/laoban";
      return <Redirect to={path}></Redirect>;
    }
    return (
      <div>
        <NavBar>老板信息完善</NavBar>
        <HeaderSelector setHeader={this.setHeader}></HeaderSelector>
        <InputItem
          placeholder="请输入职位"
          onChange={(value) => {
            this.handleChange("post", value);
          }}
        >
          招聘职位：
        </InputItem>
        <InputItem
          placeholder="请输入公司名称"
          onChange={(value) => {
            this.handleChange("company", value);
          }}
        >
          公司名称：
        </InputItem>
        <InputItem
          placeholder="请输入该职位的薪资"
          onChange={(value) => {
            this.handleChange("salary", value);
          }}
        >
          职位薪资：
        </InputItem>
        <TextareaItem
          title="职位要求："
          rows={3}
          placeholder="请输入该职位的要求"
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
  LaobanInfo
);
