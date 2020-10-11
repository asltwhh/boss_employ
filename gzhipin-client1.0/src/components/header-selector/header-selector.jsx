import React from "react";
import { List, Grid } from "antd-mobile";
import PropTypes from "prop-types";

export default class HeaderSelector extends React.Component {
  static propTypes = {
    setHeader: PropTypes.func.isRequired,
  };

  state = {
    icon: null, //图片对象，默认没有值，刚开始显示的是请选择头像
  };

  constructor(props) {
    super(props);

    // 准备需要显示的数据
    this.headerList = [];
    for (let i = 0; i < 20; i++) {
      this.headerList.push({
        text: "头像" + (i + 1),
        // 不能使用import,并且用的不是单引号，模板字符串用的是``
        icon: require(`./images/头像${i + 1}.png`),
      });
    }
  }

  // 设置头像
  handleClick = ({ text, icon }) => {
    // 更新当前组件状态
    this.setState({ icon });
    // 调用函数更新父组件状态
    this.props.setHeader(text);
  };

  render() {
    const { icon } = this.state;
    // 头部界面,如果icon没有值，则显示"请选择头像",如果icon有值，则显示"已选择头像:图片"
    const listHeader = !icon ? (
      "请选择头像:"
    ) : (
      <div>
        已选择头像：
        <img src={icon} />
      </div>
    );
    return (
      <div>
        <List renderHeader={() => listHeader}>
          {/* columnNum 指定Grid的列数 */}
          <Grid
            data={this.headerList}
            columnNum={5}
            onClick={this.handleClick}
          ></Grid>
        </List>
      </div>
    );
  }
}
