'use strict';

module.exports = {
  rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
  defineProperty(obj, property, value) {
    Object.defineProperty(obj, property, {
      value,
      writable: true,
      enumerable: true,
    });
  },
};
