// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApprove = require('../../../app/service/approve');
import ExportAuthority = require('../../../app/service/authority');
import ExportCategory = require('../../../app/service/category');
import ExportGoods = require('../../../app/service/goods');
import ExportGroup = require('../../../app/service/group');
import ExportHome = require('../../../app/service/home');
import ExportMachine = require('../../../app/service/machine');
import ExportMaterial = require('../../../app/service/material');
import ExportMerchant = require('../../../app/service/merchant');
import ExportOrder = require('../../../app/service/order');
import ExportPackage = require('../../../app/service/package');
import ExportPicCode = require('../../../app/service/picCode');
import ExportProduceGoods = require('../../../app/service/produceGoods');
import ExportProducePackage = require('../../../app/service/producePackage');
import ExportStaff = require('../../../app/service/staff');
import ExportUpload = require('../../../app/service/upload');
import ExportUser = require('../../../app/service/user');
import ExportVerify = require('../../../app/service/verify');

declare module 'egg' {
  interface IService {
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
