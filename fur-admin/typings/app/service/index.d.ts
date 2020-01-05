// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCategory = require('../../../app/service/category');
import ExportGoods = require('../../../app/service/goods');
import ExportList = require('../../../app/service/list');
import ExportOrders = require('../../../app/service/orders');
import ExportUpload = require('../../../app/service/upload');
import ExportUser = require('../../../app/service/user');
import ExportVerify = require('../../../app/service/verify');

declare module 'egg' {
  interface IService {
    category: ExportCategory;
    goods: ExportGoods;
    list: ExportList;
    orders: ExportOrders;
    upload: ExportUpload;
    user: ExportUser;
    verify: ExportVerify;
  }
}
