import ajax from "../ajax";
import Store from "@/vuex/store";

//获取二维码信息
export const reqPicCodeList = picCode => ajax('/picCode/list', picCode, 'POST', Store.state.token);
//上传二维码
export const reqUploadPicCode = picCode => ajax('/picCode/upload', picCode, 'POST', Store.state.token);
//删除二维码
export const reqDeletePicCode = picCode => ajax('/picCode/delete', picCode, 'POST', Store.state.token);
