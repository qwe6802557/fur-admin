// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCategory = require('../../../app/controller/category');
import ExportGoods = require('../../../app/controller/goods');
import ExportList = require('../../../app/controller/list');
import ExportMaterial = require('../../../app/controller/material');
import ExportOrders = require('../../../app/controller/orders');
import ExportUpload = require('../../../app/controller/upload');
import ExportUser = require('../../../app/controller/user');
import ExportVerify = require('../../../app/controller/verify');

declare module 'egg' {
  interface IController {
    category: ExportCategory;
    goods: ExportGoods;
    list: ExportList;
    material: ExportMaterial;
    orders: ExportOrders;
    upload: ExportUpload;
    user: ExportUser;
    verify: ExportVerify;
  }
}
