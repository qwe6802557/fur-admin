**React**

- library（库）:小而巧，主要是一些功能插件，按需所取，只提供了一些特定的API，对项目倾入性小。

- Framework(框架):大而全，是一个项目的完整的解决方案，对项目倾入性大。

**组件化比较**：

- 模块化：从代码的角度来进行分析的，把一些可复用的代码，抽离为单个的模块，便于项目的维护与开发。

- 组件化：是从UI界面的角度来进行分析的，把一些可复用的UI元素，抽离为单独的组件，便于项目的维护与开发。

- 组件化的好处：随着项目规模的增大，手里的组件越来越多，很方便就能把现有的组件，拼接为一个完整的网页；

- Vue实现组件化：通过‘.vue’文件，来创建对应的组件；每个组件的结构：

` template结构`

` script结构`

` style结构`

- React实现组件化：通过JS来表现的，并不像vue那样有单独的vue组件，需要有ES6与ES7的基础。

**虚拟DOM：**

- DOM的本质：浏览器中的概念，用JS对象来表示页面上的元素，并提供了操作DOM对象的API；

- React中的虚拟DOM：是框架中的概念，是程序员用JS对象来模拟页面上的DOM和DOM嵌套；

- [ ] 虚拟DOM的目的：为了实现页面中，DOM元素的高效更新。

  例：

  > DOM：<div class='myclass' id='myclass' name='myclass'>我真帅<p>你是帅</p></div>
  > JS模拟：var div={
  > 		我真帅,
  > 		Tagname:'div',
  > 		attr:{
  > 			class:'myclass',
  > 			id:'myclass',
  > 			name:'myclass'
  > 		},
  > 		children:[
  > 			{
  > 				你是帅,
  > 				Tagname:'p'
  > 			}
  > 		]
  > }

 **Diff算法：**

- tree diff:新旧两课DOM树，逐层对比的过程，就是Tree Diff;当整颗Dom逐层对比完毕，则所有需要被按需更新的元素，必然能够找到。

- component diff:在进行Tree Diff的时候，每一层中，组件级别的对比，叫做Component Diff

> 如果对比前后，组件的类型相同，则暂时认为此组件不需要被更新。

> 如果对比前后，组件类型不同，则需要移除旧组件，创建新组件，并追加到页面上。

- element diff：在进行组件对比的时候，如果两个组件类型相同，则需要进行元素级别的对比，这叫做Element Diff;

**创建基本的webpack4.x项目：**

1.运行 `npm init -y` 快速初始化项目；

2.在项目中建立`dist`与`src`两个目录；

3.在`src`目录中建立`index.js`与`index.html`;

4.安装webpack，命令为`npm install webpack webpack-cli-D`

5.创建`webpack.config.js`配置文件；

6.webpack4.x约定大于配置，所以我们直接在`webpack.config.js`文件配置`module.exports={`

`mode:'production'}`后运行webpack命令便能得到压缩后的`main.js`文件，引入即可使用。  `//mode有两个可选值，`        `development是不压缩，production是压缩。`

配置web-dev-server:  //用于实时更新代码效果，webpack-dev-server打包的main.js文件是托管到内存中的，在项目根目录看不见，我们可以假装在项目根目录中有一个main.js进行引用。

1.npm install web-dev-server -D

2.在package.json中的script标签中配置`"dev": "webpack-dev-server --open --port 3000 --hot --progress --compress --host 127.0.0.1"`

3.运行命令：npm run dev

配置html-webpack-plugin： //用于设置打开网站跳到首页，自动在html中追加<script src="/main.js"></script>

在webpack.config.js中配置的代码：

```
const path=require('path');
const webpackPlugin=require('html-webpack-plugin');
var htmlPlugin=new webpackPlugin({
template:path.join(__dirname,'/src/index.html'),   
filename:'index.html'})
module.exports={
    mode:'production',
    plugins: [
        htmlPlugin
    ]
}
```

**开始React项目：**

1.`npm install react react-dom -s`

2.在main.js中书写代码：

```
import React from 'react'
import ReactDom from 'react-dom'

//1.创建虚拟Dom元素
//参数1：创建的元素类型，字符串，表示元素的名称
//参数2：是一个对象或null,表示当前这个Dom元素
//参数3：子节点（包括 其他 虚拟Dom 获取 文本子节点）
//参数n：其他子节点
const myh1=React.createElement('h1',{id:'myh1',title:'myh1'},'this is my world!');


//2.渲染到页面上
//参数1：要渲染的那个虚拟dom元素
//参数2：指定页面上一个容器 例如：document.getElementById('app')
ReactDom.render(myh1,document.getElementById('app'));
```

**以上的方式为React最基本的代码，由于过于麻烦，因为渲染Dom结构最好的方式就是在HTML中写，因此我们采用JSX写法：**

JSX语法：在JS中书写符合JS与xml规范的语法，例如：const mydiv=<div>我是一只小鸟小鸟</div>，本质还是将其转换为React基本创建代码来执行的。

const定义的基本数据类型值不能再变，当定义一个对象数据类型时，保证其地址值不变，也就是指针不变，可以修改其对象属性，但是不能再将该变量指向另外一个对象。

**启用JSX语法：**

1. 安装babel插件

   `npm install babel-core babel-loader@7 babel-plugin-transform-runtime -D`

​       `npm install babel-preset-env babel-preset-stage-0 babel-preset-react -D`

2.由于webpack只能打包处理.js文件，不能处理.png, .vue等文件，所以需要安装第三方插件来进行处理：

webpack.config.js配置中加入：

```
module: {    rules: [        {            test: /\.js|jsx$/, use: 'babel-loader', exclude: /node_modules/        }    ]}
```

创建.babelrc文件，写入预设与配置：

```
{  "presets": ["env","stage-0","react"],  
   "plugins": ["transform-runtime"]}
```

**JSX的语法：**

```
let a=10;
const div=<div>这是一个div{a}</div>;
ReactDom.render(div,document.getElementById('app'));
```

vue与react中key的作用：保持循环数组状态，避免”内分泌失调“，能保持新加入元素后还是原来勾选的勾选了，没勾选的没勾选，状态已知。

在React中需要把key传给foreach和map或for循环直接控制的元素

var new=[];

arr.foreach(item=>{

var eachItem=<h1 key={item}>{item}</h1>;

new.push(eachItem);

})

**React创建组件的方式**：  //props是只读的 不可修改

```
function hello(props) {    return <div>这是一个hello组件--props.name--props.age</div>}
```

为该组件传递数据：

```
ReactDom.render(<Hello name={dog.name} age={dog.age}></Hello>,document.getElementById('app'))
```

通过ES6来传：

```
ReactDom.render(<Hello {...dog}></Hello>,document.getElementById('app'))
```

抽离React单独组件，创建一个JSX文件：

```
import React from 'react'
function Hello(props) {    
return <div>这是一个hello组件--props.name--props.age</div>}
export default Hello;
```

在main.js中通过import Hello from '../components/Hello.jsx' 来引入

若想引入时不写jsx 需要在webpack.config.js中配置：

```
resolve: {    extensions: [        '.js','.jsx','json'    ]  //表示这几个文件后缀名可以省略不写}
```

配置项目根路径：

```
resolve: {    extensions: [        '.js','.jsx','json'    ],   //表示这几个文件后缀名可以省略不写} 
alias: path.join(__dirname,'./src')
```

**使用class关键字创建组件：**

```
class Moveis extends React.Component{   
render(){        
return <div>这是一个大大的div--this.props.name--this.props.age</div>    
}}  //传参方式同function创建组件一样
```

**两种创建方式的对比：**

使用class创建的组件有自己的私有数据，而使用fucntion创建的组件，只有props，没有自己的私有数据和生命周期函数。

在class创建的组件中加入私有数据：

```
class Moveis extends React.Component{    
constructor(){     
this.state={         msg:'helloworld'     }    
}    
render(){       
return <div>这是一个大大的div</div>    
}}
```

**有状态与无状态组件之间的区别：有无state属性和有无生命周期函数**

props与state/data之间的区别：props中的数据都是外界传进来的，state/data中的数据，都是组件私有的。

props中的数据都是只读的，而state/data中的数据是可读可写的。

#### `创建组件时，组件名一定要大写开头！！！`

#### JSX中插入样式的方式：

```
<h1 style={{color:"red"}}>这是评论列表组件</h1>
```

{}表示写入JS代码，再{}表示对象；

若要在JSX中用class的形式引入外部样式表 则需要安装css-loader处理：

`npm install style-loader css-loader -D`

并在webpack.config.js中的module模块中配置：

```
{    test: /\.css$/, use: ['style-loader','css-loader']}
```

**解决使用外部样式表组件冲突问题：**

在css-loader后追加?modules  表示为普通的css样式表,启用模块化。

`{    test: /\.css$/, use: ['style-loader','css-loader?modules']}`

> css选择器只针对ID选择器和类选择器生效，不会对标签选择器生效。



# React绑定事件：

标准写法：

![1569739582370](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569739582370.png)

改变state值的写法：this.state({})

![1569740082309](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569740082309.png)



## React中双向数据流的方法：

在表单元素中加入onChange={()=>{this.事件名}} 通过事件赋值给this.state:其中获取文本框的value有两种方式，一是通过事件对象e来获取,二是通过ref绑定，然后通过this.refs.绑定ref名称.value来获取

![1569744253182](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569744253182.png)

React中想要获取DOM节点利用this.refs.绑定的ref名称



# React的生命周期函数：

![1569825416972](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569825416972.png)

使用static defaultProps给props属性设置默认值：

![1569825759797](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569825759797.png)

校验外界传的props值：用static propTypes:

![1569826413728](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569826413728.png)

![1569826714995](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569826714995.png)



**代码示例理解React周期函数：**

组件将要被挂载函数：

![1569827111284](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569827111284.png)

render函数：

![1569827226792](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569827226792.png)

挂载完成函数：//要获取页面上的元素最早只能在此函数中进行。

![1569827526996](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569827526996.png)

判断是否更新组件函数：

![1569828479630](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569828479630.png)

将要更新组件函数：

![1569828658716](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569828658716.png)

再次render： //数据仍是旧的

渲染完成函数：

![1569828889656](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569828889656.png)



componentWillReceiveProps函数：

![1570091180854](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570091180854.png)



**关于修改函数this属性的方式：**

方式一：

![1570091683759](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570091683759.png)

方式二：

![1570092335172](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570092335172.png)

方式三：箭头函数：

![1570092592648](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570092592648.png)



# React中循环渲染数据的方式：



**循环渲染生成节点：**![1570093667998](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570093667998.png)



**父组件传值给子组件方式：**

方式一：//不适用于子组件 孙子组件很多

![1570094326513](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570094326513.png)



方式二：

![1570094450858](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570094450858.png)

![1570094878825](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570094878825.png)

![1570094911004](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570094911004.png)





# React中的路由：

**使用：**![1570095392450](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570095392450.png)

![1570095568199](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570095568199.png)

![1570095823154](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570095823154.png)

![1570096075685](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570096075685.png)



**动态路由：**

![1570096351280](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570096351280.png)



**路由传参：**

![1570096219961](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570096219961.png)



**项目踩坑：**

![1570694358400](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570694358400.png)

# Ant-design React库：

安装：

![1570191411390](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570191411390.png)

按需引入：

![1570192094578](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570192094578.png)



# React中的Ajax获取数据

![1570518302421](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570518302421.png)

![1570519417391](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570519417391.png)

![1570521728850](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570521728850.png)





## ReactNative

![1570775101701](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570775101701.png)



## Redux:

![1571798533006](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571798533006.png)

### 使用：

**生成并暴露store对象：**

   **reducers中：**

![1571802009367](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571802009367.png)

![1571800997624](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571800997624.png)

**新建文件夹结构：**

![1571801227368](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571801227368.png)

**在action-types.js中定义action type的字符串变量：**

![1571801348486](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571801348486.png)



**在actions中定义生成函数：** **//先引入action-types.js**

![1571801521111](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571801521111.png)

**引入使用： ** //使用export暴露的单个对象要用 * as 变量名 引入 或者解构赋值，单变量名引入是用来导入export deafult方式导出的对象的；

![1571801596116](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571801596116.png)

**调用更新store状态：**

![1571801747203](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571801747203.png)

**引入使用并更新store:**

![1571801066765](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571801066765.png)



**使用react-redux插件简化代码：**

![1571971347538](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571971347538.png)

![1571971604530](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571971604530.png)

![1571971668523](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571971668523.png)

![1571971716717](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571971716717.png)

![1571972214696](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571972214696.png)

**使用react-thunk使redux支持ajax发送：**

![1571972735592](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571972735592.png)

![1571972913798](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571972913798.png)

![1571973046663](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571973046663.png)

**使用redux-devtools-extension查看redux中的数据：**

![1571973258045](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571973258045.png)