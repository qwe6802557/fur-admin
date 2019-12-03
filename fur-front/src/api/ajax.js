import axios from 'axios'

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
            withCredentials:true,
            headers:{
              'Authorization':`Bearer ${token}`
            }
          });
        }
      }
      promise.then(res=>{
        resolve(res);
      }).catch(err=>{
        reject(err);
      })
    })
  }
