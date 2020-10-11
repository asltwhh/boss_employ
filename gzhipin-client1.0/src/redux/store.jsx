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