// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApprove = require('../../../app/controller/approve');
import ExportAuthority = require('../../../app/controller/authority');
import ExportCategory = require('../../../app/controller/category');
import ExportGoods = require('../../../app/controller/goods');
import ExportGroup = require('../../../app/controller/group');
import ExportHome = require('../../../app/controller/home');
import ExportMachine = require('../../../app/controller/machine');
import ExportMaterial = require('../../../app/controller/material');
import ExportMerchant = require('../../../app/controller/merchant');
import ExportOrder = require('../../../app/controller/order');
import ExportPackage = require('../../../app/controller/package');
import ExportPicCode = require('../../../app/controller/picCode');
import ExportProduceGoods = require('../../../app/controller/produceGoods');
import ExportProducePackage = require('../../../app/controller/producePackage');
import ExportStaff = require('../../../app/controller/staff');
import ExportUpload = require('../../../app/controller/upload');
import ExportUser = require('../../../app/controller/user');
import ExportVerify = require('../../../app/controller/verify');

declare module 'egg' {
  interface IController {
    approve: ExportApprove;
    authority: ExportAuthority;
    category: ExportCategory;
    goods: ExportGoods;
    group: ExportGroup;
    home: ExportHome;
    machine: ExportMachine;
    material: ExportMaterial;
    merchant: ExportMerchant;
    order: ExportOrder;
    package: ExportPackage;
    picCode: ExportPicCode;
    produceGoods: ExportProduceGoods;
    producePackage: ExportProducePackage;
    staff: ExportStaff;
    upload: ExportUpload;
    user: ExportUser;
    verify: ExportVerify;
  }
}
