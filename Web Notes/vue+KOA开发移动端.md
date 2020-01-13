# 使用babel来实现按需引入

命令：

![1570176520686](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570176520686.png)

配置：在.babelc中：

![1570176671308](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570176671308.png)

即可按需引入：

![1570176797132](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570176797132.png)



# 以iphone5为基准来实现移动端适配：

![1570177872390](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570177872390.png)

注意：iphone5下的根元素字体大小为16px，所以其中的20是iphone的设备独立像素320/16得到的，以此类推。



# MongoDB:



**功能**：![1570760710146](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570760710146.png)

**schema表结构类型：**

![1570760797027](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570760797027.png)

**glob模块：**![1570761660817](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570761660817.png)

***密码的加密加盐处理***：

用bcrypt插件进行加密；

引入：

![1570763781911](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570763781911.png)



加密加盐：

![1570763761731](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570763761731.png)



#### 编程式导航传值：

![1571486969896](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571486969896.png)

***使用path传值则要用query***，相应用this.$route.query.goodsId进行接收

![1571487006957](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1571487006957.png)

***使用name传值就要用params*** 相应用this.$route.params.goodsId进行接收