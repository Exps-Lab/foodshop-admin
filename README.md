
<p align="center">
  <img width="180" src="http://static.foodshops.fun/G5jFHRBPy8RwPhM.png" alt="logo">
</p>

# FoodShop
一个有完整全流程(商品列表，定位推荐，下单，支付，配送(定时任务)，订单，个人中心)业务场景的C端外卖项目，由20多个的页面承载实现!

## Admin管理后台wiki
- [admin wiki说明文档](https://github.com/exp-express/admin-user/wiki)

## 实现的各个页面以及对应文档：
>* Login 页面：
   [Click It!](https://github.com/Exps-Lab/foodshop-admin/wiki/Login%E9%A1%B5%E9%9D%A2%E9%9C%80%E6%B1%82%E7%82%B9)

>* 菜单管理 页面：
   [Click It!](https://github.com/Exps-Lab/foodshop-admin/wiki/%E8%8F%9C%E5%8D%95%E7%AE%A1%E7%90%86%E9%A1%B5%E9%9D%A2)

>* 商铺管理 页面：
   [Click It!](https://github.com/Exps-Lab/foodshop-admin/wiki/%E5%95%86%E9%93%BA%E7%AE%A1%E7%90%86-%E9%9C%80%E6%B1%82%E7%82%B9)

>* 商品管理 页面：
   [Click It!](https://github.com/Exps-Lab/foodshop-admin/wiki/%E5%95%86%E5%93%81%E7%AE%A1%E7%90%86-%E9%9C%80%E6%B1%82%E7%82%B9)

## 用户端技术栈
Vue3 + Vue-router +Vite + Pinia + Arco-Design + SPA

## 项目运行
```
版本要求：
node (14.20 及以上版本)
```

```
git clone https://github.com/Exps-Lab/foodshop-admin.git

cd foodshop-admin

npm install

npm run dev

访问: http://localhost:8888（可依照需要自行更改配置）

```
> Tips：最好同时启动foodshop-node端server的项目。目前foodshop-admin项目数据都是从接口获取的真实数据！

## h5效果演示
#### h5端线上效果演示，直接扫码体验：
<img width="200" src="http://static.foodshops.fun/ns6dBb2iJWbteQi.png" alt="qrcode">

#### Admin管理后台截图
#### 欢迎页：
<img width="200" src="https://github.com/Exps-Lab/foodshop-admin/blob/master/screenshot/welcome.png" alt="welcome">

#### 商铺列表页：
<img width="200" src="https://github.com/Exps-Lab/foodshop-admin/blob/master/screenshot/shopList.png" alt="商铺列表">

#### 添加商铺页：
<img width="200" src="https://github.com/Exps-Lab/foodshop-admin/blob/master/screenshot/shopModify.png" alt="添加商铺">

#### 商品变更页：
<img width="200" src="https://github.com/Exps-Lab/foodshop-admin/blob/master/screenshot/addGoods.png" alt="商品添加">

#### 用户列表页：
<img width="200" src="https://github.com/Exps-Lab/foodshop-admin/blob/master/screenshot/userList.png" alt="用户列表页">

## 关联项目列表
| 项目             | 项目描述       | 技术栈                                                                    | 项目链接          |
|----------------|----------------|------------------------------------------------------------------------|-----------------|
| foodshop-h5    | FoodShop售卖系统——h5用户端 | Vue3 + Vite + Vant + MPA                                               | https://github.com/Exps-Lab/foodshop-h5     |
| foodshop-node  | FoodShop售卖系统——server端 | Node + Mongodb + Mongoose + Express + Redis + RabbitMQ + Nginx + MVC模式 | https://github.com/Exps-Lab/foodshop-node   |
| foodshop-admin | FoodShop售卖系统——admin管理后台端| Vue3 + Vite + Arco.design + SPA                                        | https://github.com/Exps-Lab/foodshop-admin     |

## 项目结构简介
```
.
├── README.md
├── build
│   └── new_tag.sh              生成tag脚本
├── index.html                  模板文件
├── package.json
├── public                      公共
│   └── favicon.ico
├── screenshot                  项目截图
│   ├── addGoods.png
│   ├── shopList.png
│   ├── shopModify.png
│   ├── userList.png
│   └── welcome.png
├── src
│   ├── App.vue                 项目入口
│   ├── api                     ajax定义
│   │   ├── common
│   │   ├── goods
│   │   ├── login
│   │   ├── menu
│   │   └── shop
│   ├── assets
│   │   └── logo.png
│   ├── auth.js                 路由权限控制
│   ├── components
│   │   └── ImgUpload           图片上传组件
│   ├── main.js                 js入口
│   ├── pages
│   │   ├── dashboard           控制台
│   │   ├── goods               商品相关页
│   │   ├── layout              基础布局页
│   │   ├── login               登录页
│   │   ├── menu                菜单展示
│   │   ├── noAuth              无权限展示页
│   │   ├── shop                商铺相关页
│   │   └── userList            用户列表页 todo
│   ├── router
│   │   └── index.js            路由表
│   ├── store
│   │   ├── auth.js             权限store
│   │   └── user.js             存储用户信息
│   ├── styles
│   │   ├── index.less          全局样式
│   │   └── reset.less          reset重置默认
│   └── utils                   工具类
│       ├── index.js
│       ├── login_token.js
│       └── request.js
├── vite.config.js              vite配置
└── viteConf
    ├── cssConf.js              vite拆分postcss配置
    └── index.js

29 directories, 53 files

```

## License
[GPL](https://github.com/Exps-Lab/foodshop-h5/blob/master/LICENSE)
