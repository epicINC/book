#  JavaScript 历程

​	JavaScript 是 1985年 Netscape（即网景公司）推出，最初名 LiveScript，后因和 Sun 公司合作，改名为 JavaScript。（注：JavaScript 和 Java 其实没有任何直接关系） 

​	当时推出是为了替代大红大紫的 Java applet，而后 Java applet 慢慢退出了舞台。

​	此后的十几年 JavaScript 一直不温不火，只是作为页面效果的点缀。知道 Web2.0 的兴起，带宽有了质的提升，人们对页面效果质量有了很大提升，不在满足于页面跑个浮窗这样的效果。JavaScript 开始兴起，并快速发展，应用范围也开始扩展，不再限于浏览器。应用程序，App，HybridApp，服务端等。技术也日新月异， SPA，SSR，PWA等等。

​	

​	JavaScript 是 Oracle 的注册商标，所以微软另起炉灶做了个叫 JScript，后来在 Ecma 协调下多方协调统一了标准即 ECMAScript。



# Node.js 与 npm

[`Node.js`](https://nodejs.org) 是居于 V8 引擎的 JavaScript 运行时，几乎是全平台的，Windows Linux macOS ARM x86 PPC等。

[`npm`](https://www.npmjs.com) Node Package Manage，Node.js 自带的包管理器，因为 node 的包大多数都是 JavaScript 写的，所以几乎也都是跨平台的。另外还有其他优秀的包管理器 比如 [yarn](https://www.yarnpkg.com) 等。

## npm 介绍

### 项目初始化

`npm init`

### package.json 项目描述文件

``` javascript
{
  "name": "koademo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "S",
  "license": "ISC",
  "dependencies": {
    "koa": "^2.6.2"
  },
  "devDependencies": {
  }
}
```

### 安装包

`npm i <pkgname>`





# SPA 框架

+ [Vue.js](https://www.vuejs.org)
+ [React](https://reactjs.org)
+ [AngularJS](https://angularjs.org)



# 应用程序

+ [electron](https://electronjs.org)

典型案例：

+ [Atom](https://atom.io)
+ [Visual Studio Code](https://code.visualstudio.com)

