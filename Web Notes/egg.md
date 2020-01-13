# Egg框架：

## 1.安装

![1569577580406](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569577580406.png)

## 目录结构图

![1569671400490](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569671400490.png)

### Get传值:

**在controller函数中通过this.ctx.query获取。**

**动态路由传值：类似于/news/123方式，在路由中配置/news/:Id,在controller中通过this.ctx.params**

**配置egg模板引擎**：

`npm install egg-view-ejs --save`

**在config目录下找到plugin.js**

exports.ejs={

  enable:true,

  package:'egg-view-ejs'

}

**再在config目录下找到config.default.js**

exports.view={

mapping:{

'.html':"ejs"

}

}

**在egg中配置art-template:**

![1571628650964](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571628650964.png)

**Contoller与service自带的this对象：**

![1571626060757](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571626060757.png)



![1571626164414](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571626164414.png)



### extend目录新增拓展：

![1571712845593](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571712845593.png)

**aplication拓展：**

![1571711932797](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571711932797.png)

**helper拓展：**

![1571712243701](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571712243701.png)



#### middleware（中间件）: //基于KOA的洋葱模型：

![1571713252131](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571713252131.png)

![1571713243337](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571713243337.png)



![1571713389183](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571713389183.png)

![1571713811960](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571713811960.png)

![1571713972295](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571713972295.png)

**案例：实现屏蔽指定用户IP访问**：

![1571714831162](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571714831162.png)

**egg安全约定：**

![1571715543959](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571715543959.png)

![1571715702396](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571715702396.png)

**配置中间件实现约定：**

![1571715976801](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571715976801.png)

### egg中的cookies与session设置：

![1571723923703](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571723923703.png)



![1571724029331](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571724029331.png)

![1571724622047](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571724622047.png)

![1574389949410](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1574389949410.png)

![1574390984032](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1574390984032.png)

![1574391447028](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1574391447028.png)

![1574391480857](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1574391480857.png)

![1574650190420](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1574650190420.png)

#### CTX配置对象：

![1574650259698](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1574650259698.png)



![1574650616281](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1574650616281.png)





![1574650686373](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1574650686373.png)

## 拓展类：

![1574650892482](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1574650892482.png)

![1574651090501](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1574651090501.png)

### 运行环境差异性：

![1574651663085](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1574651663085.png)



![1574651607247](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1574651607247.png)





# KOA配置ejs模板引擎：

![1569810886692](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569810886692.png)

![1569811267936](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569811267936.png)

![1569811845163](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569811845163.png)

##### 带变量渲染：

![1569811390597](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569811390597.png)

![1569811874180](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569811874180.png)

**循环渲染：**

![1569812260376](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569812260376.png)

**引入外部公共文件：**

![1569812976012](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569812976012.png)

**解析HTML字符串：**

![1569813355287](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569813355287.png)

![1569813370109](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569813370109.png)

**if判断语句：**

![1569813749891](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569813749891.png)

**配置中间件来写入公共的信息，供所有页面使用：**

![1569814076370](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569814076370.png)

![1569814088734](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569814088734.png)



# KOA配置body-parser:

![1569814596811](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569814596811.png)

![1569814604140](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569814604140.png)

通过ctx.request.body来获取post提交的数据



原生node获取提交数据：

```
exports.orgin=function (ctx) {    return new Promise((resolve, reject)=>{        try {            let str='';            ctx.req.on('data',function (chunk) {                str+=chunck;            })            ctx.req.on('end',function (chunk) {                resolve(str)            })        }catch (err) {            console.log(err);        }    })}
```

![1569815028004](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569815028004.png)



# KOA配置静态资源文件：

![1569815395244](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569815395244.png)

配置还可以![1569815419009](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569815419009.png)



# KOA配置KOA-art-template：

**安装：**

```
npm install --save art-templatenpm 
install --save koa-art-template
```

**配置：**

```
const render = require('koa-art-template');
```

```
render(app, {  root: path.join(__dirname, 'view'),  extname: '.art',  debug: process.env.NODE_ENV !== 'production'});
```

模板引擎相关用法：http://aui.github.io/art-template/koa/



# KOA使用cookies：

设置cookies为Set，取cookies为get：![1569823188029](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569823188029.png)

cookies属性：

![1569823479197](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569823479197.png)

KOA中没法设置中文的cookies，解决办法：

![1569823734018](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569823734018.png)



# KOA中的session:

![1569904947361](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569904947361.png)

![1569904963939](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569904963939.png)

![1569905177481](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569905177481.png)



**安装和使用：**

npm install koa-session -s

引包

配置：

![1569905553945](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569905553945.png)

![1569905636003](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569905636003.png)

使用：

ctx.session.userinfo='张三'



#### **MongoDB数据库封装：//单例模式   目的是为了提高性能，只实例化一次。** 

> Class DB(){
>
> static getInstance(){
>
> if(!DB.instance){      //DB.instance为实例对象
>
> DB.instance=new Db();
>
> }
>
> return DB.instance;
>
> }
>
> constuctor(){
>
>  console.log('触发构造函数!');
>
> 
>
> }
>
> connect(){
>
> console.log('连接数据库！');
>
> }
>
> find(){
>
> consloe.log('查询数据库!')
>
> }
>
> }
>
> var DB1=DB.getInstance;
>
> var DB2=DB.getInstance;
>
> //只执行DB1实例化



***Node.js操作mongoDB数据库：***

![1569908817603](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569908817603.png)

![1569908872829](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569908872829.png)

增加数据：

![1569909160152](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569909160152.png)

查询数据:

![1569909278895](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1569909278895.png)





单一实例模式封装mogoDB：

//DB库
var MongoClient = require('mongodb').MongoClient;

var Config=require('./config.js');

class Db{


    static getInstance(){   /*1、单例  多次实例化实例不共享的问题*/
    
        if(!Db.instance){
            Db.instance=new Db();
        }
        return  Db.instance;
    }
    
    constructor(){
    
        this.dbClient=''; /*属性 放db对象*/
        this.connect();   /*实例化的时候就连接数据库*/
    
    }
    
    connect(){  /*连接数据库*/
      let _that=this;
      return new Promise((resolve,reject)=>{
          if(!_that.dbClient){         /*1、解决数据库多次连接的问题*/
              MongoClient.connect(Config.dbUrl,(err,client)=>{
    
                  if(err){
                      reject(err)
    
                  }else{
    
                      _that.dbClient=client.db(Config.dbName);
                      resolve(_that.dbClient)
                  }
              })
    
          }else{
              resolve(_that.dbClient);
    
          }


      })
    
    }
    
    find(collectionName,json){
    
       return new Promise((resolve,reject)=>{
    
           this.connect().then((db)=>{
    
               var result=db.collection(collectionName).find(json);
    
               result.toArray(function(err,docs){
    
                   if(err){
                       reject(err);
                       return;
                   }
                   resolve(docs);
               })
    
           })
       })
    }
    update(){
    
    }
    insert(){


    }
}

module.exports=Db.getInstance();



# KOA的应用生成器：

![1570082067132](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570082067132.png)



**配置子路由： //路由模块化**

后台模块化：

![1570082570664](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570082570664.png)



前台模块化：

![1570083566624](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570083566624.png)





#### **企业级:**

![1570083755861](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570083755861.png)

