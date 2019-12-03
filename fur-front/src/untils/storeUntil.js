import Store from 'store'

export default {
  getToken(){
    return Store.get('token')|| '';
  },
  setToken(token){
    return Store.set('token',token);
  },
  delToken(){
    return Store.remove('token');
  }
}
