/**
 * vuex数据管理 -- state
 */
import storeUntil from "@/untils/storeUntil";
export default {
  userInfo: {},
  token: storeUntil.getToken(),
  detailUse: [],
  package_material: []
}
