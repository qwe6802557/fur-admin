export const cssInit_leftBar=()=>{
  let Height=document.documentElement.clientHeight;
  let elItems=document.querySelectorAll('.left-nav .el-menu-item');
  let index=0;
  document.querySelector('.el-menu-vertical-demo').style.height=Height-61+'px'
  for (let i=0;i<elItems.length;i++){
    elItems[i].index=i;
    elItems[i].onmouseenter=function () {
      if (this.index===index){
        this.style.background='#54B2FE !important';
      }else {
        this.classList.add('el-menu-item_hover');
      }
    }
    elItems[i].onmouseleave=function () {
      if (this.index!=index){
        this.classList.remove('el-menu-item_hover')
      }
    }
    elItems[i].onclick=function () {
      index=this.index;
    }
  }
}
