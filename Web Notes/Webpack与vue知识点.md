**打包命令：**
webpack ./src/main.js -o ./dist/bundle.js -mode development

**Bable安装指令**：
npm install babel-loader babel-loader babel-plugin-transform-runtime -D
npm install babel-preset-env babel-preset-stage-0 -D

**创建vue项目命令顺序：**
npm install vue-cli -g  //全局安装脚手架
vue init webpack vuedemo //指定打包工具webpack加项目名称
cd vuedemo
npm install
npm run dev

**打包命令：**
npm run build

**发布1：使用静态服务器工具包**

npm install serve -g

serve dist
访问：http://localhost:5000

**发布2：使用动态web服务器（tomcat）**

修改配置:webpack.prod.conf.js
   output:{
   publicPath:'/xxx/'   //打包文件夹的名称
}

重新打包：
   npm  run build
修改dist文件夹为项目名称：xxx
讲xxx拷贝到运行的tomcat的webapps目录下
访问：http://localhost:8080/xxx



**vue中watch方法的深度监视：**

watch:{
		arr:{
			deep:true, //开启深度监视
		    handler:function(newValue){
				window.localStorage.setItem('arr',JSON.stringify(newValue));  //深度监视回调函数 两个参数oldVlue与newValue
			}
		}
	}

`@自定义事件传值只适用于父子组件`

`vue中存在monted属性用来执行异步代码，也可用于绑定事件传值：`

`mounted(){`

`this.$ref.header.$on('addto',this.addto);  //this.$ref.header表示用ref绑定的dom元素，$on是绑定自定义事件参数为函数名+传递的函数`

`}`

**发布消息与订阅消息：**用于任意组件之间的传值

安装：npm install pubsub-js

引入：在组件里script标签引入import PubSub from 'pubsub-js'

父组件：

mounted(){

PubSub.subscribe('qwe',(msg,index)=>{

this.delete(index)

})  //订阅消息 消息名与发布名一样 msg就是前面的消息名，可以忽略

}



子组件：

PubSub.publish('qwe'，index) //发布消息名+发布内容

**slot：**插槽，用于传递标签，当一个组件需要复用而不同的区域是不同的标签元素时适用，所有相关事件绑定在父组件中，子组件用<slot name="你定义的name"></slot>挖坑，在主组件<slot-footer>区域中用标签属性slot="你定义的name"来填坑。



### Vuex：

![1569830473494](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569830473494.png)

![1569830514484](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569830514484.png)





操作步骤：

![1569830940848](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569830940848.png)

![1569831590918](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569831590918.png)

![1569832633202](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569832633202.png)

![1569832654080](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569832654080.png)





# Git使用：

![1570870648376](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570870648376.png)

![1570870787853](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570870787853.png)

