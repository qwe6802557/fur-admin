'use strict';

module.exports={
    rand(min,max){
      return Math.floor(Math.random()*(max-min))+min;
    }
}