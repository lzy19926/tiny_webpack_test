
//todo webpack 引入外部包测试
import { Axios } from 'axios';

//todo npm 内部包引入测试(webpack和watchpack不能被打包进浏览器)
import React from 'lzy-react'
import MicroApp from 'lzy-microapp'
import Qiankun from 'lzy-qiankun'
import ReactQuery from 'lzy-react-query'
import Router from 'lzy-react-router'
import Ruzy from 'lzy-ruzy'
import LzyUI from 'lzy-ui'



console.log(Axios); // ok
console.log(React); // ok
console.log(ReactQuery); //OK
console.log(Ruzy); // OK
console.log(Qiankun); //ok
console.log(Router); //ok
console.log(MicroApp); // ok
console.log(LzyUI); // ok




