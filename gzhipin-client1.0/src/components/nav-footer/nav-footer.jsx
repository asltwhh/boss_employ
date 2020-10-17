import React from "react";
import { TabBar } from "antd-mobile";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

const Item = TabBar.Item;
class NavFooter extends React.Component {
  static propTypes = {
    navList: PropTypes.array.isRequired,
  };

  render() {
    //   需要显示的导航项
    let { navList } = this.props;
    // 过滤掉hide为true的nav
    navList = navList.filter((nav) => !nav.hide);
    // 获取当前请求的路径
    const path = this.props.location.pathname;
    return (
      <div>
        <TabBar>
          {navList.map((nav) => (
            <Item
              key={nav.path}
              title={nav.text}
              icon={{ uri: require(`./images/${nav.icon}.png`) }}
              selectedIcon={{
                uri: require(`./images/${nav.icon}-selected.png`),
              }}
              selected={path === nav.path}
              onPress={() => this.props.history.replace(nav.path)}
            ></Item>
          ))}
        </TabBar>
      </div>
    );
  }
}

// 使用withRouter包装产生的组件可以使用路由组件的API，原来的组件NavFooter属于非路由组件
// 非路由组件不能访问路由组件的API
// 被withRouter包装的组件会自动传入history,location,match等路由组件的API
export default withRouter(NavFooter);
