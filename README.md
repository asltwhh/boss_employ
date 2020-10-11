# 1 准备

### 1.1 项目描述

- (1) 这是一个前后台分离的招聘的 SPA 应用，包括前台应用和后台应用
- (2) 包括用户注册、登录，大神列表、老板列表，实时聊天等模块
- (3) 前端：使用 React+ES6+Webpack 等技术
- (4) 后端：使用 Node+express+mongodb+socketIO 等技术
- (5) 采用模块化、组件化、工程化的模式开发

### 1.2 项目的功能界面

![01](./img/01.png)
![02](./img/01.png)

### 1.3 项目打包

- 生成打包文件：npm run build
- 下载静态服务器：npm install -g serve
- 运行打包文件：serve build
- 如果想通过 npm 命令运行打包文件，可以在项目文件夹的 package.json 文件的 scripts 中添加`"client": "serve build"`,然后通过 npm run client 实现打包文件的运行
  - 可以发现 npm start，npm run build 等都是这样设定 npm 命令的

```
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "client": "serve build"
},
```

### 1.4 使用 antd-mobile 实现按需打包并且自定义 anti-mobile 主题颜色

- 参考：https://www.jianshu.com/p/7097348cd900

#### (1)准备工作

- 首先需要下载一些依赖包：`babel-plugin-import react-app-rewired customize-cra`

```
npm install --save-dev babel-plugin-import react-app-rewired customize-cra
```

- 然后修改 package.json 文件，使用 react-app-rewired 启动、编译项目：

```
/* package.json */
"scripts": {
   "start": "react-app-rewired start",
   "build": "react-app-rewired build",
   "test": "react-app-rewired test",
}
```

- 然后在项目根目录下创建一个`config.overrides.js`，用于修改默认配置

```
module.exports = function override(config, env) {
  // do stuff with the webpack config...
  return config;
};
```

#### （2）antd-mobile 按需加载

- 这里使用 customize-cra 对 webpack 配置进行覆盖，避免将 webpack 直接暴露出来。修改 config-overrides.js 文件：

```
 const { override, fixBabelImports } = require('customize-cra');

 module.exports = override(
   fixBabelImports('import', {
     libraryName: 'antd-mobile',
     libraryDirectory: 'es',
     style: 'css',
   }),
 );
```

- 修改 antd-mobile 组件导入方式：`import { Button } from 'antd-mobile';`
- 然后重启项目，就可以看到组件样式存在了

#### （3）antd-mobile 定制主题颜色

- 下载相关的依赖包,注意：less-loader 需要制定版本号，否则会报错

```
npm install --save-dev less style-loader css-loader
npm install --save-dev less-loader@5.0.0
```

- 修改 config-overrides.js 文件实现主题颜色的更改：使用 addLessLoader 插入 less-loader，`修改style为true`，确保加载 less 文件。根据 modifyVars 项自由定制主题，一般由外部导入主题包赋值给 modifyVars

```
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: {
        "@brand-primary": "#ff5722", //平常的颜色
        "@brand-primary-tap": "#ffccbc",  // 按下时的颜色
        "@color-text-base-inverse": "#3f51b5"  // 字体的颜色
      },
    }),
    fixBabelImports('import', {
      libraryName: 'antd-mobile',
      libraryDirectory: 'es',
      // 要修改，否则只会加载css文件
      style: true,
    }),
);
```

### 1.5 引入路由

- 首先下载依赖包：`npm install react-router-dom --save`
- 定义路由组件：
  - 一般路由组件均会与 redux 进行交互，所以会将路由组件放在 containers 中
  - 三个一级路由组件：注册界面，登录界面，主界面(老板列表)
- 先搭建框架，创建三个空组件：
- ![03](./img/03.png)
- 然后再入口文件中引入相关的路由组件，实现初始化：

```
// 入口js文件
import React from 'react'
import ReactDOM from 'react-dom'
import {Button} from 'antd-mobile'
import {HashRouter, Route, Switch} from 'react-router-dom'

import Register from './containers/register/register'
import Login from './containers/login/login'
import Main from './containers/main/main'

ReactDOM.render(
  (
    <HashRouter>
      <Switch>
        <Route path='/register' component={Register}></Route>
        <Route path='/login' component={Login}></Route>
        {/* 除了path是上面两个外，其余路径均会显示Main组件 */}
        <Route component={Main}></Route>
      </Switch>
    </HashRouter>
  ),
  document.getElementById('root')
)
```

### 1.6 引入 redux

- 先下载依赖包:

```
// redux负责管理组件状态 react-redux负责减小耦合 redux-thunk在redux中实现异步任务
// 注意：redux不能下载最新版本
npm install --save redux@3.7.2 react-redux redux-thunk

// redux-devtools-extension是redux调试工具
npm install --save-dev redux-devtools-extension
```

- 先在 redux 文件夹中创建相关的文件
- ![04](./img/04.png)
- 由于 store.js 文件内容比较固定，就是从包中加载得到 store 对象，但是由于它需要使用到 reducers.js 中设定的纯函数，所以先按照纯函数的形式大致定义 reducers.js 的代码如下：

```
/*
包含n个reducer函数：根据老的state和指定的action返回一个新的state
*/
import {combineReducers} from 'redux'

function xx(state=0, action){
    return state;
}

function yy(state=0, action){
    return state;
}

// 合并所有的reducer函数，向外暴露
export default combineReducers({
    xx,
    yy
})

// 向外暴露的结构：{xx:0, yy:0}
```

- 然后确定 store.js 文件，得到 store 对象：

```
/*
redux最核心的管理模块:这个代码比较固定
*/

import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import reducers from './reducers'

var store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunk))
)
// 向外暴露store对象
export default store;
```

- 最后在 index.js 入口文件中引入 store 对象及相关的组件：

```
// 入口js文件
import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Route, Switch} from 'react-router-dom'
import {Provider} from 'react-redux'

import Register from './containers/register/register'
import Login from './containers/login/login'
import Main from './containers/main/main'
import store from './redux/store'

ReactDOM.render(
  (
      <Provider store={store}>
        <HashRouter>
          <Switch>
            <Route path='/register' component={Register}></Route>
            <Route path='/login' component={Login}></Route>
            {/* 除了path是上面两个外，其余路径均会显示Main组件 */}
            <Route component={Main}></Route>
          </Switch>
        </HashRouter>
      </Provider>
  ),
  document.getElementById('root')
)
```

- 项目运行后，发现在调试工具中 state 有值，则上面的内容设置成功
- ![05](./img/05.png)

# 2 实现登录注册页面

### 2.1 静态注册界面

- 界面比较简单，基本的组件都是由 antd-mobile 提供的，可以去官网查看每个组件的具体用法，都比较简单

```
/*
    注册路由组件
*/

import React from 'react'
import {NavBar, WingBlank, List, InputItem, WhiteSpace, Radio, Button} from 'antd-mobile'

import Logo from '../../components/logo/logo'

const ListItem = List.Item;
export default class Register extends React.Component{
    state = {
        username: '',    //用户名
        password: '',    // 密码
        password2: '',   // 确认密码
        type: 'laoban'         // 用户类型
    }

    register = () => {
      // 获取注册的信息
        console.log(this.state);
    }

    handleChange = (name, value) => {
        // 更新状态,要用[name]，这样才会作为变量，否则就会直接去查找state中的name属性，而state中没有name属性
        this.setState({[name]:value})
    }

    toLogin =() =>{
        // 已有账户，则进入登录界面
        this.props.history.replace('/login');
    }

    render(){
        const {type} = this.state;
        return (
            <div>
                <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
                <Logo></Logo>
                {/* WingBlank表示两边留白  WhiteSpace表示上下留白 */}
                <WingBlank>
                    <List>
                        <InputItem placeholder='请输入用户名' onChange={value => {this.handleChange('username',value)}}>用户名：</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder='请输入密码' type='password' onChange={value => {this.handleChange('password',value)}}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder='请再次输入密码进行确认' type='password' onChange={value => {this.handleChange('password2',value)}}>确认密码：</InputItem>
                        <ListItem>
                            <span>用户类型：</span>&nbsp;&nbsp;&nbsp;
                            <Radio checkd={type==='dashen'} onChange={()=>this.handleChange('type','dashen')}>大神</Radio>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checkd={type==='laoban'} onChange={()=>this.handleChange('type','laoban')}>老板</Radio>
                        </ListItem>
                        <Button type='primary' onClick={this.register}>注&nbsp;&nbsp;&nbsp;册</Button>
                        <Button onClick={this.toLogin}>已有账户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
```

### 2.2 实现静态登录界面

```
/*
    登录路由组件
*/

import React from 'react'
import {NavBar, WingBlank, List, InputItem, WhiteSpace, Button} from 'antd-mobile'

import Logo from '../../components/logo/logo'

export default class Login extends React.Component{

    state = {
        username: '',  // 用户名
        password: ''   // 密码
    }

    handleChange = (name, value) => {
        // 修改状态值
        this.setState({[name]:value});
    }

    logIn = () => {
        // 得到状态值，也就是文本框中输入的表单数据
        console.log(this.state);
    }

    toRegister = () => {
        // 还没有账户，则直接进入注册界面
        this.props.history.replace('/register');
    }
    render(){
        return (
            <div>
                <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
                <Logo></Logo>
                {/* 表示两边留白 */}
                <WingBlank>
                    <List>
                        <InputItem placeholder='请输入用户名' onChange={value => {this.handleChange('username', value)}}>用户名：</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder='请输入密码' type='password' onChange={value => {this.handleChange('password', value)}}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
                        <WhiteSpace />
                        <Button type='primary' onClick={this.logIn}>登&nbsp;&nbsp;&nbsp;录</Button>
                        <Button onClick={this.toRegister}>还没有账户?点击注册</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
```

# 3 搭建后台应用

### 3.1 创建 node+express 应用

- 1 在 vscode 中先安装 express 插件
  ![06](./img/06.png)
- 2 再安装 express 应用生成器：`npm install -g express-generator`
- 3 产生 express 应用：`express -e app_name`
  - 使用`-e`是因为这样产生的应用下的 views 文件夹下是.ejs 文件
  - `express -e app_name`or`express app_name`在 views 文件夹下会产生`.jade`文件
  - 使用`express --no-view app`产生的是 html 界面，在 public 文件夹下
- 4 安装其他的依赖包:`npm install`
  - express 创建项目的时候，对于一些库，例如 http-errors，这些库不是 node 自带的核心模块，但是确是 express 框架必须要用到的。所以得用命令 npm install 初始化一下，把这些 express 依赖的库装入。
- 5 运行项目：`npm start`,然后在浏览器的 3000 端口查看结果：http://127.0.0.1:3000/
  ![07](./img/07.png)

- 6 目录结构：

```
  bin, 存放启动项目的脚本文件
  node_modules, 存放所有的项目依赖库。
  public，静态文件(css,js,img)
  routes，路由文件(MVC中的C,controller)
  views，页面文件(Ejs模板)
  package.json，项目依赖配置及开发者信息
  app.js，应用核心配置文件
```

### 3.2 注册一个路由，实现对于前台 post 请求的响应

- 在`routes->index.js`中添加以下代码：

```
// 注册一个路由: 用户注册
/*
a)path为: /register
b)请求方式为: POST
c)接收username和password参数
d)admin是已注册用户
e)注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
f)注册失败返回: {code: 1, msg: '此用户已存在'}
 */

router.post('/register', function (req, res) {
  console.log('register()')
  // 1. 获取请求参数
  const {username, password} = req.body
  // 2. 处理
  if(username==='admin') { // 注册会失败
    // 返回响应数据(失败)
    res.send({code: 1, msg: '此用户已存在222'})
  } else { // 注册会成功
    // 返回响应数据(成功)
    res.send({code: 0, data: {id: 'abc123', username, password}})
  }
})
```

### 3.3 实现后台应用自动重运行---nodemon 包

- 每次修改应用代码，都需要重新执行命令 npm start 才会生效，太麻烦了
- 解决：使用 nodemon 包，下载`npm install --save-dev nodemon`
- 在 json 文件中配置：`"start":"nodemon ./bin/www"`
- 这样，npm start 后，只要修改任何文件的内容，保存之后，就会自动重启整个项目

### 4 使用 mongoose 操作数据库----回顾数据库的几个基本操作

- 先下载 mongoose 包和一个用于实现 md5 加密的包`npm install --save mongoose blueimp-md5`
- 在`gzhipin-server`文件夹下创建一个文件`db-->db_test.js`,用户回顾并且测试相关的数据库操作方法

```
/*
测试使用mongoose操作mongodb数据库
1. 连接数据库
  1.1. 引入mongoose
  1.2. 连接指定数据库(URL只有数据库是变化的)
  1.3. 获取连接对象
  1.4. 绑定连接完成的监听(用来提示连接成功)
2. 得到对应特定集合的Model
  2.1. 字义Schema(描述文档结构)
  2.2. 定义Model(与集合对应, 可以操作集合)
3. 通过Model或其实例对集合数据进行CRUD操作
  3.1. 通过Model实例的save()添加数据
  3.2. 通过Model的find()/findOne()查询多个或一个数据
  3.3. 通过Model的findByIdAndUpdate()更新某个数据
  3.4. 通过Model的remove()删除匹配的数据
 */

//  引入md5加密包
const md5 = require('blueimp-md5');  //得到一个md5加密函数

 // 连接数据库
 // 1.1. 引入mongoose
 const mongoose = require('mongoose');
//  1.2. 连接指定数据库(URL只有数据库是变化的)
 mongoose.connect('mongodb://localhost:27017/gzhipin_test', { useNewUrlParser: true, useUnifiedTopology: true });
//  1.3. 获取连接对象
 const conn = mongoose.connection;
//  1.4. 绑定连接完成的监听(用来提示连接成功)
 conn.on("connected",function(){
     // 连接成功回调
     console.log('数据库连接成功...')
 })

//  2. 得到对应特定集合的Model
//   2.1. 字义Schema(描述文档结构)
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: {type:String,required:true}, // 用户名
    password: {type:String,required:true}, // 密码
    type: {type:String,required:true} //用户类型，dashen或者laoban
})
//   2.2. 定义Model(与集合对应, 可以操作集合)
var UserModel = mongoose.model('user',userSchema);  //集合名users


// 3. 通过Model或其实例对集合数据进行CRUD操作
//   3.1. 通过Model实例的save()添加数据
function testSave(){
    const userModel = new UserModel({
        username: '百度老板',
        password: md5('baidulaoban'),
        type: 'dashen'
    })
    // 调用save保存数据
    userModel.save(function(err,userdocs){
        if(!err){
            console.log(userdocs);
        }
    })
}
// testSave()
//   3.2. 通过Model的find()/findOne()查询多个或一个数据
function testFind(){
    // find查询多个，没有匹配则返回[]
    UserModel.find({},function(err,userdocs){
        if(!err){
            console.log(userdocs);
        }
    })
    // 查询匹配的第一个，没有匹配返回null
    UserModel.findOne({_id:'5f7d6937e216a53e741f7caa'},function(err,userdoc){
        if(!err){
            console.log(userdoc);
        }
    })
}
// testFind()
//   3.3. 通过Model的findByIdAndUpdate()更新某个数据
function testUpdate(){
    // 查询匹配的第一个，没有匹配返回null
    UserModel.findByIdAndUpdate({_id:'5f7d6937e216a53e741f7caa'},{$set:{username:'阿里巴巴'}},function(err,userdoc){
        // 这里可以不用$set,直接{username:'阿里巴巴'}即可更改
        if(!err){
            // 返回的doc是改变之前的内容
            console.log(userdoc);
        }
    })
}
// testUpdate()
//   3.4. 通过Model的remove()删除匹配的数据
function testRemove(){
    // 查询匹配的第一个，没有匹配返回null
    UserModel.remove({_id:'5f7d6937e216a53e741f7caa'},function(err,res){
        if(!err){
            // 返回的是{ ok: 1, n: 1, deletedCount: 1 }
            // res.n表示匹配的doc的数量，ok:1表示删除成功，res.deletedCount表示删除的doc的数量
            console.log(res);
        }
    })
}
testRemove()
```

- 这里发现了 vscode 中操作数据库的方法:

  - 下载插件`Azure Cosmos DB`
  - ![08](./img/08.png)
  - 然后点击最后的小图标，`Attach Database Accounts-->mongodb-->选择对应的数据库`
  - ![09](./img/09.png)

- 测试路由是否设置成功的软件：postman 因为我们设置的是 post 请求的响应，而浏览器一般发送的都是 get 请求，所以需要借助这个软件操作
- ![11](./img/11.png)

# 5 注册登录的后台处理

### 5.1 注册的后台处理

- 1 连接数据库，定义用户集合模型，方便进行新用户注册的查询和保存管理
  - `db--->models.js`

```
// 1. 连接数据库
// 1.1. 引入mongoose
const mongoose = require('mongoose');
// 1.2. 连接指定数据库(URL只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/gzhipin',{ useNewUrlParser: true, useUnifiedTopology: true })
// 1.3. 获取连接对象
const conn = mongoose.connection;
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected',function(){
    console.log('数据库连接成功....');
})
// 2. 定义出对应特定集合的Model并向外暴露
// 2.1. 字义Schema(描述文档结构)
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: {type:String, required:true},  //用户名
    password: {type:String, required:true},  // 密码
    type: {type:String, required:true},      // 类型dashen或者laoban
    header:{type:String},  //头像名称
    post:{type:String},    // 职位
    info:{type:String},    // 个人或者职位简介
    company:{type:String}, // 公司名称
    salary:{type:String}   // 工资
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user',userSchema);
// 2.3. 向外暴露Model
exports.UserModel = UserModel;
```

- 2 在`routes-->index.js中`定义注册路由：

```
// 加密
const md5 = require('blueimp-md5')
// 引入用户的集合模型，实现新用户数据的保存
const UserModel = require('../db/models').UserModel;

// 处理注册请求的路由
router.post('/register',function(req,res){
  // 获取请求参数
  const {username,password,type} = req.body;
  // 处理
    // 判断用户是否已经存在，存在则不能注册，返回错误信息，不存在则保存注册信息
    UserModel.findOne({username},function(err,userdox){
      // 如果user有值，则存在，不能注册
      if(userdox){
        // 返回错误信息
        res.send({code:1, msg:'用户已经注册'});
      }else{
        // 保存用户信息到数据库并且返回响应信息
        // 密码的保存不能以明文的方式，需要加密
        var userModle = new UserModel({username,password:md5(password),type});
        userModle.save(function(err,userdox){
          // 生成一个cookie，1000表示1秒钟，1000*60*60*24*7表示7天
          res.cookie("userid",userdox.id,{maxAge:1000*60*60*24*7});  //
          //返回包含user的json数据
          // 响应数据中不要携带密码，所以自己先封装一个对象
          const data = {username,type,_id:userdox._id}
          res.send({code:0, data});
        })
      }
    })
  // 返回响应数据
})
```

- 3 测试注册路由
  - 使用 postman 软件
  - 先注册一个新用户，发送请求，然后再次发送请求，会返回{code:1, msg:'用户已经注册'}
  - 这就表明成功

![10](./img/10.png)

### 5.2 登录后台的处理

- 1 在`routes-->index.js中`定义登录路由：

```
// 加密
const md5 = require('blueimp-md5')
// 引入用户的集合模型，实现新用户数据的保存
const UserModel = require('../db/models').UserModel;

// 登录的路由
router.post('/login',function(req,res){
  // 获取请求参数
  const {username,password} = req.body;
  // 处理
    // 根据username和password查询，没有则用户不存在，提示错误信息，有则返回登陆成功的信息
    const filter = {password:0,_v:0};  // 或者'-password -_v' 返回的userdox中不包含password
  UserModel.findOne({username,password:md5(password)},filter,function(err,userdox){
    if(userdox){
      // 登陆成功
      // 生成一个cookie，1000表示1秒钟，1000*60*60*24*7表示7天
      res.cookie("userid",userdox.id,{maxAge:1000*60*60*24*7});
      // 返回登陆成功的信息
      res.send({code:0,data:userdox})
    }else{
      res.send({code:1,msg:'用户名或者密码不正确'})
    }
  })
  // 返回响应结果
})
```

- 2 测试如注册同

# 6 注册、登录的前台处理

### 6.1 axios-ajax 与后台交互

- 1 下载依赖包：`npm --save install axios`
- 2 在`src-->api--->ajax.js`中建立发送 ajax 请求的函数，将 post 请求和 get 请求封装在一个函数中

```
// 能发送ajax请求的函数模块
import axios from 'axios'
export default function ajax(url,data={},method='GET'){
    if(method === "GET"){
        // {username:tom,password:123}
        // paramStr: username=tom&password=123
        let paramStr = '';
        Object.keys(data).forEach(key => {
            paramStr += ( key + '=' + data[key] +'&');
        })
        if(paramStr){
            paramStr = paramStr.substring(0,paramStr.length-1);
        }
        // 使用axios发送get请求
        return axios.get(url+'?'+paramStr);
    }else{
        axios.post(url,data);
    }
}
```

- 3 在`api--->index.js`中定义注册时发送 ajax 请求、登录时发送 ajax 请求的方法：

```
/*
包含了n个接口请求的模块
*/
import ajax from './ajax'

// 注册接口
export const reqRegister = (user) => ajax('/register', user, 'POST')
// 登陆接口
export const reqLogin = ({username, password}) => ajax('/login',{username, password}, 'POST')
```

### 6.2 redux 状态管理

- redux 状态管理：有一个状态存储对象 store,整个应用的 state 被保存在一棵 Object tree 中，而它只存在于唯一一个 store 对象中，state 是只读的，唯一一个改变 state 的方法就是触发 action
- 首先创建一个 store 对象：相当于创建好了一个仓库

```
import { createStore } from 'redux'  //  引入createStore方法
const store = createStore() // 创建数据存储仓库
```

- 但是这个仓库很混乱，这时候就需要一个具有管理能力的模块出现，就是 Reducers。

```
const defaultState = {}  //默认数据
function reducer(state = defaultState,action)=>{  //就是一个方法函数
    return state
}
```

- 需要将 Reducer 引入到 store 仓库中，以参数的形式引入，实现仓库的管理

```
import { createStore } from 'redux'  //  引入createStore方法

// 产生reducer
const defaultState = {}  //默认数据
function reducer(state = defaultState,action)=>{  //就是一个方法函数
    return state
}

// 创建仓库store
const store = createStore(reducer) // 创建数据存储仓库
```

- 然后我们可以将默认数据初始化一下，这就相当于为 store 对象添加属性,并且在 store 对象中查看

```
import { createStore } from 'redux'  //  引入createStore方法

// 产生reducer
const defaultState = {
  username:'孙悟空',
  age: 18
}  //默认数据
function reducer(state = defaultState,action)=>{  //就是一个方法函数
    // state:旧的状态值  action:{action的类型,新的状态值}
    return state
    // 这里return state就是将新的state返回到仓库store中保存起来，并不是reducer更新state的
    // reducer只是返回了新的state,store对自己进行了更新
}

// 创建仓库store
const store = createStore(reducer) // 创建数据存储仓库

// 查看
console.log(store.getState()) //就会打印defaultState的内容
```

- 首先需要产生一个 action 对象
- 然后由 dispatch 方法将 action 对象传递给 reducer
- reducer 根据旧的 state 和 action 对象产生新的 state,可以有多个小的 reducers,每个 reducers 分别独立地操作 state tree 的不同部分
- store 对象负责更新 state,并且由于容器组件将 state 作为 props 传递给了展示组件 Register,所以 state 更新后，展示组件就会渲染更新的部分

- 第一步：先确定需要使用的 action 行为名称，在`action-type.js`:保存 action 对象的名称类型，是干什么事的

```
// 用户注册成功或者登陆成功时需要dispatch的内容
export const AUTH_SUCCESS = 'auth_success'  //注册或者登陆成功的action-type
export const ERROR_MSG = 'error_msg'
```

- 第二步：产生 action 对象，{名称,data}`action.js`

```
/*
包含多个action creators
    异步action
    同步action
*/
import {reqRegister,reqLogin} from '../api'
import {AUTH_SUCCESS,ERROR_MSG} from './action-types'

// 授权成功的同步action对象
const authSuccess = (user) => ({type:AUTH_SUCCESS, data:user})
// 授权失败，错误提示信息的同步action对象
const errorMsg = (msg) => ({type:ERROR_MSG, data:msg})

// 注册异步action
export const register = (user) => {

    // 注册时的user是由表单项组成的，注册时需要填写以下四项内容，所以解析得到的就是这四项
    const {username,password,password2,type} = user;

    // 做表单的前台验证
    if(!username) {
        return errorMsg('用户名不能为空');
    }
    else if(password !== password2) {
        return errorMsg('两次输入密码不一致');
    }

    //表单数据合法，返回一个发ajax请求的异步action函数
    return async dispatch => {
        // 发送注册的异步请求   使用await可以直接获取到response，不使用await得到的是promise对象
        // 还需要再then再得到response
        // 但是一旦某个语句使用了await,就需要在其前面添加async
        /*

        // 这里用的是之前定义的发送注册ajax请求的函数，返回的是Promise对象
        const promise = reqRegister(user);
        promise.then(response => {
            const result = response.data;  {code:0/1,data:user,msg:''}
        })
        */
        const response = await reqRegister({username,password,type});
        const result = response.data;

        // 根据发送ajax请求后，响应报文的设定，code:0表示注册成功，用户信息已经添加到数据库中
        // code:1表示该用户已经注册过或者必须需要填写的项没有填写
        if(result.code === 0){
            // 成功,分发授权成功的同步action
            dispatch(authSuccess(result.data));
        }else{
            // 失败,分发提示错误信息的同步action
            dispatch(errorMsg(result.msg))    // 此用户已经注册过了
        }
    }
}

// 登录异步action
export const login = (user) => {
    const {username,password} = user;
    // 做表单的前台验证
    if(!username) {
        return errorMsg('用户名不能为空');
    }
    else if(!password) {
        return errorMsg('密码不能为空');
    }

    return async dispatch => {
        // 发送注册的异步请求   使用await可以直接获取到response，不使用await得到的是promise对象
        // 还需要再then再得到response
        // 但是一旦某个语句使用了await,就需要在其前面添加async
        /*
        const promise = reqRegister(user);
        promise.then(response => {
            const result = response.data;  {code:0/1,data:user,msg:''}
        })
        */
        const response = await reqLogin({username,password});
        const result = response.data;
        if(result.code === 0){
            // 成功,分发授权成功的同步action
            dispatch(authSuccess(result.data));
        }else{
            // 失败,分发提示错误信息的同步action
            dispatch(errorMsg(result.msg))      // 这里会提示什么信息呢？？？？
        }
    }
}
```

- 第三步：获得新的 state,在 reducers.jsx 中定义纯函数：

```
/*
包含n个reducer函数：根据老的state和指定的action返回一个新的state
*/
import {combineReducers} from 'redux'

import {AUTH_SUCCESS,ERROR_MSG} from './action-types'

// 产生user状态的reducer
const initUser = {
    username: '',   // 用户名
    type: '',   //用户类型
    msg: '',   // 存放错误提示信息
    redirectTo:''  //需要自动重定向的路由路径
}
function user(state=initUser, action){
    switch (action.type){
        case AUTH_SUCCESS:   //data存放user
            return {...state, ...action.data,redirectTo:'/'};
        case ERROR_MSG:   // data存放msg
            return {...state, msg:action.data};
        default:
            return state;
    }
}


// 合并所有的reducer函数，向外暴露
export default combineReducers({
    user
})

// 向外暴露的结构：{user:{}}
```

- 第四步：store.js 不需要调整

- 第五步：在 containers/register/register.jsx 中:
  - 1 引入 react-redux 包中的 connect 函数，将 store 对象中的 state 属性及产生异步 action 对象的 register 函数传递给 Register 组件
  - 2 为注册按钮添加事件单击函数，单击注册按钮后自动发送注册 ajax 异步请求

```
import {connect} from 'react-redux'

class Register extends React.components{

  // 点击注册调用,this
  register = () => {
    // console.log(this.state);
    // 不需要传入password2,
    this.props.register(this.state);
  }

  ...
}


export default connect(
    state => ({user:state.user}),
    {register}
)(Register)
```

- 前端应用端口号为 3001,后台应用端口号为 4000，所以前端去想后台发送请求就属于跨域，解决办法：加入代理
  - 在 package.json 中添加"proxy": "http://localhost:4000"
  - 原理：前台应用 3000，添加一个代理服务器帮忙将请求转发到另一个端口实现请求

### 6.3 component——大神信息完善界面和老板信息完善界面

#### （1）静态组件

![12](./img/12.png)
可以看到这两个界面对应两个路由组件 LaobanInfo、dashenInfo，可以看到在选择头像并且进行信息的补充之后需要保存信息，即需要将信息保存到数据库中，也就是需要进行交互，所以应该将这两个组件放在 containers 中

观察两个组件可以发现具有相同的一部分，头像选择部分的形式相同，所以可以将这一部分单独拎出来作为一个 UI 组件:headerSelector:

```
import React from "react";
import { List, Grid } from "antd-mobile";

export default class HeaderSelector extends React.Component {
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

  render() {
    // 头部界面
    const listHeader = "请选择头像";
    return (
      <div>
        <list renderHeader={() => listHeader}>
          {/* columnNum 指定Grid的列数 */}
          <Grid data={this.headerList} columnNum={5}></Grid>
        </list>
      </div>
    );
  }
}
```

老板信息完善页面：

```
/*
老板信息完善的路由容器组件
*/

import React from "react";
import { connect } from "react-redux";
import { NavBar, InputItem, TextareaItem, Button } from "antd-mobile";

import HeaderSelector from "../../components/header-selector/header-selector";

class LaobanInfo extends React.Component {
  render() {
    return (
      <div>
        <NavBar>老板信息完善</NavBar>
        <HeaderSelector></HeaderSelector>
        <InputItem placeholder="请输入职位">招聘职位：</InputItem>
        <InputItem placeholder="请输入公司名称">公司名称：</InputItem>
        <InputItem placeholder="请输入该职位的薪资">职位薪资：</InputItem>
        <TextareaItem
          title="职位要求："
          rows={3}
          placeholder="请输入该职位的要求"
        />
        <Button type="primary">保&nbsp;&nbsp;&nbsp;存</Button>
      </div>
    );
  }
}

export default connect((state) => ({}), {})(LaobanInfo);
```

大神信息完善页面：

```
/*
大神信息完善的路由容器组件
*/

import React from "react";
import { connect } from "react-redux";
import { NavBar, InputItem, TextareaItem, Button } from "antd-mobile";

import HeaderSelector from "../../components/header-selector/header-selector";

class DashenInfo extends React.Component {
  render() {
    return (
      <div>
        <NavBar>大神信息完善</NavBar>
        <HeaderSelector></HeaderSelector>
        <InputItem placeholder="请输入理想职位">应聘职位：</InputItem>
        <TextareaItem
          title="个人介绍："
          rows={3}
          placeholder="请简单介绍自己"
        />
        <Button type="primary">保&nbsp;&nbsp;&nbsp;存</Button>
      </div>
    );
  }
}

export default connect((state) => ({}), {})(DashenInfo);
```

#### （2）动态交互：数据收集

分析：
老板信息收集主要有 5 个部分：老板的头像、提供的职位、公司、薪资、职位要求

    onChange事件将这些数据更新到LaobanInfo组件的state中
    有一个问题：设置头像
      在Grid中有一个事件点击onClick函数,点击某个头像就会给其onClick函数传入两个参数：text,icon,这两个参数就是设置头像需要使用的
      但是我们的头像文本header保存在父组件LaobanInfo中，如果我们想要在子组件HeaderSelector中修改父组件的state属性，就应该在父组件中定义一个函数setHeader进行修改，然后将该函数传递给子组件

      在HeaderSelector组件中，由于点击某个头像之后，显示的文本会从"请选择头像"变为"已选择头像"，所以需要设置一个state属性去判断，该state={icon:null},icon是一个图片对象，点击了某个头像后，就会更新该组件的state，此时icon就变成了一个有内容的对象，通过判断icon是否有内容，就可以选择是显示"请选择头像"，还是显示"已选择头像icon"

      在点击了某个头像并且更新了icon后，还需要更新父组件显示的文本header,就可以调用父组件传过来的setHeader(text)。
