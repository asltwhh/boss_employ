/* 
大神信息完善的路由容器组件
*/

import React from "react";
import { connect } from "react-redux";
import { NavBar, InputItem, TextareaItem, Button } from "antd-mobile";

import HeaderSelector from "../../components/header-selector/header-selector";

class DashenInfo extends React.Component {
  state = {
    header: "", // string:"请选择头像"或者"已选择头像"
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
    console.log(this.state);
  };
  render() {
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

export default connect((state) => ({}), {})(DashenInfo);
