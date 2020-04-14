/**
 * mutations同步数据管理
 */
export default {
  changeUserInfo (state, userInfo) {
    state.userInfo = userInfo;
  },
  changeToken (state, token) {
    state.token = token;
  },
  changeDetailUse (state, detailUse) {
    state.detailUse = detailUse;
  },
  changePackageMaterial (state, packageMaterial) {
    if (packageMaterial){
      state.package_material.push(packageMaterial);
    } else {
      state.package_material = [];
    }
  }
}
