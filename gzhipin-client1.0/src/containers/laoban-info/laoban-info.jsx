/* 
老板信息完善的路由容器组件
*/

import React from "react";
import { connect } from "react-redux";
import { NavBar, InputItem, TextareaItem, Button } from "antd-mobile";

import HeaderSelector from "../../components/header-selector/header-selector";

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
    console.log(this.state);
  };
  render() {
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

export default connect((state) => ({}), {})(LaobanInfo);
