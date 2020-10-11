// 只显示logo，即一张图片，不需要状态

import React from 'react'

import './logo.less'
import logo from './logo.png'

export default function Logo(){
    return (
        <div className="logo-container">
            <img src={logo} alt="logo" className='logo-img'/>
        </div>
    )
}