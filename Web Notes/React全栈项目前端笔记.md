## 前端路由设计：

![1571035879371](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571035879371.png)



## 接口概念：

![1571036005320](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571036005320.png)

## 开始项目准备：

![1571036493319](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571036493319.png)

![1571036767134](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571036767134.png)

![1571036869486](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571036869486.png)

## 创建基本项目结构：

![1571037793866](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571037793866.png)

#### 安装babel-plugin-import实现按需打包：

### 使用 babel-plugin-import 详情见：https://ant.design/docs/react/use-with-create-react-app-cn

> 注意：antd 默认支持基于 ES module 的 tree shaking，js 代码部分不使用这个插件也会有按需加载的效果。

[babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 是一个用于按需加载组件代码和样式的 babel 插件（[原理](https://ant.design/docs/react/getting-started-cn#按需加载)），现在我们尝试安装它并修改 `config-overrides.js` 文件。

`npm install babel-plugin-import`

```bash

+ const { override, fixBabelImports } = require('customize-cra');

- module.exports = function override(config, env) {
-   // do stuff with the webpack config...
-   return config;
- };
+ module.exports = override(
+   fixBabelImports('import', {
+     libraryName: 'antd',
+     libraryDirectory: 'es',
+     style: 'css',
+   }),
+ );
```

### less less-loader模块：

详情见：https://ant.design/docs/react/use-with-create-react-app-cn

`$ yarn add less less-loader`

```bash

- const { override, fixBabelImports } = require('customize-cra');
+ const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
-   style: 'css',
+   style: true,
  }),
+ addLessLoader({
+   javascriptEnabled: true,
+   modifyVars: { '@primary-color': '#1DA57A' },
+ }),
);
```

## Antd封装组件的高阶函数与高阶组件思想：

**高阶函数：**

![1571130021672](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571130021672.png)



![1571130069788](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571130069788.png)



**高阶组件：**

![1571130428443](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571130428443.png)



****

****

**用户名及密码验证：**

![1571297132844](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571297132844.png)



**对密码进行自定义验证： **//用于程序员自行拓展验证方法

![1571297497637](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571297497637.png)

![1571297631385](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571297631385.png)



**表单校验：**

![1571298206649](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571298206649.png)



**git管理项目：**

![1571298352516](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571298352516.png)

![1571298390318](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571298390318.png)



**配置代理来解决跨域：**

![1571392346915](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571392346915.png)



**使用async await来简化promise代码：**

![1571584521596](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571584521596.png)



**优化ajax请求处理：** //包装ajax请求返回一个promise对象 在promise对象中处理了错误提示。

![1571585824773](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571585824773.png)

####  import 必须在其它所有业务代码前面（eslint 暴出）:  //踩坑

![1571642258750](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571642258750.png)

### 页面路由多层后须重新修改页面css引入路径：//踩坑

![1571729196874](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571729196874.png)非

### 非路由组件获取路由组件的history：//用到withRouter高阶组件，作用：将非路由组件转换为路由组件。

![](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571730385900.png)

### antd中的selectedKeys与defaultselectedKeys的坑：

selectedkey为动态获取，defaultselectedkey不会动态获取。

**Jsonp通过百度地图获取天气等信息：**

![1571816519411](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571816519411.png)

### 制作通用按钮：

![1571824044490](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571824044490.png)



### **回调函数传参的坑：**

![1572084035837](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1572084035837.png)

***this.setState（）是异步操作***

![1572086652076](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1572086652076.png)

## 坑：

![1572255299755](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1572255299755.png)

遇到了ajax发送更新后默认值不更新的问题，解决办法是调用this.props.form.resetFields（）方法



## 分页：

![1572781898581](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1572781898581.png)

