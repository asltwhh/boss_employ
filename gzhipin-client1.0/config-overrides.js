const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@brand-primary": "#1cae82", // 正常
      "@brand-primary-tap": "#1DA57A", // 按下
      // "@color-text-base-inverse": "#3f51b5", // 字体的颜色
    },
  }),
  fixBabelImports("import", {
    libraryName: "antd-mobile",
    libraryDirectory: "es",
    // 要修改，否则只会加载css文件
    style: true,
  })
);
