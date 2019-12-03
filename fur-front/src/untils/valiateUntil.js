import {Message} from "element-ui";
import memoryUntil from '@/untils/memoryUntil';
import storeUntil from '@/untils/storeUntil';
export const valiateToken=(code,message,router)=>{
  if (code===8){
    Message.error(message);
    memoryUntil.token=null;
    storeUntil.delToken();
    router.push({name:'Main'});
    return false;
  }else if (code!=6 && code!=7 && code!=9) {
    return true;
  }else {
    Message.error(Message);
    return false;
  }
}
