/* 个人中心界面的路由组件 */
import React from "react";
import { connect } from "react-redux";
import { Result, List, Button, Modal } from "antd-mobile";
import Cookies from "js-cookie";
import { resetUser } from "../../redux/actions";

const Item = List.Item;
const Brief = Item.Brief;

class Personal extends React.Component {
  logout = () => {
    Modal.alert("退出", "确定退出登录吗？", [
      {
        text: "取消",
        onPress: () => {
          console.log("cancel");
        },
      },
      {
        text: "确定",
        onPress: () => {
          // 干掉cookie中的userid
          Cookies.remove("userid");
          // 重置redux中的user状态
          this.props.resetUser(); //resetUser会将redux中的user设置为初始的state状态
        },
      },
    ]);
  };
  render() {
    const { username, header, company, post, salary, info } = this.props.user;
    return (
      <div style={{ marginBottom: 50, marginTop: 50 }}>
        {/* Result中规定的内容有就会显示，没有就不会显示 */}
        <Result
          img={
            <img
              alt={header}
              src={require(`../../assets/images/${header}.png`)}
            />
          }
          title={username}
          message={company}
        />

        <List renderHeader={() => "相关信息"}>
          <Item multipleLine>
            {/* Item默认是单行显示， multipleLine表示多行显示*/}
            <Brief>职位：{post}</Brief>
            <Brief>简介：{info}</Brief>
            {/* 需要判断，有salary属性就显示薪资，没有就不显示 */}
            {salary ? <Brief>薪资：{salary}</Brief> : null}
          </Item>
        </List>

        <Button type="warning" onClick={this.logout}>
          退出登录
        </Button>
      </div>
    );
  }
}
export default connect((state) => ({ user: state.user }), { resetUser })(
  Personal
);
