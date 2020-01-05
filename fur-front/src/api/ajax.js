import axios from 'axios';
import {Message} from "element-ui";
import memoryUntil from '@/untils/memoryUntil';
import storeUntil from '@/untils/storeUntil';
import router from '@/router/index.js';
import Vue from 'vue'

const vue=new Vue({
  router
})
export default function ajax(url,data=null,method="GET",token){
  return new Promise((resolve,reject)=>{
    let promise=0;
    if (!token){
      if (method==="GET"){
        promise=axios({
          url:url,
          method:method.toLowerCase(),
          withCredentials:true,
          params:data
        })
      }else{
        promise=axios({
          url:url,
          method:method.toLowerCase(),
          data:data,
          withCredentials:true
        });
      }
    }else{
      if (method==="GET"){
        promise=axios({
          url:url,
          method:method.toLowerCase(),
          withCredentials:true,
          params:data,
          headers:{
            'Authorization':`Bearer ${token}`
          }
        })
      }else{
        promise=axios({
          url:url,
          method:method.toLowerCase(),
          data:data,
          withCredentials:true, //允许跨域携带cookies
          headers:{
            'Authorization':`Bearer ${token}`
          }
        });
      }
    }
    promise.then(res=>{
      const {code,message}=res.data;
      if (code===8){
        Message.error(message);
        memoryUntil.token=null;
        storeUntil.delToken();
        vue.$router.push({name:'Main'});
      }else if(code===6 || code===7 || code===9){
        Message.error(message);
        vue.$router.push({name:'Main'});
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
