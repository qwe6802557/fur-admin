// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApprove = require('../../../app/model/approve');
import ExportAuthority = require('../../../app/model/authority');
import ExportCategory = require('../../../app/model/category');
import ExportFriendList = require('../../../app/model/friend-list');
import ExportGoodsPackage = require('../../../app/model/goods-package');
import ExportGoodsStatus = require('../../../app/model/goods-status');
import ExportGoods = require('../../../app/model/goods');
import ExportGroupMember = require('../../../app/model/group-member');
import ExportGroup = require('../../../app/model/group');
import ExportMachine = require('../../../app/model/machine');
import ExportMaterialUse = require('../../../app/model/material-use');
import ExportMaterial = require('../../../app/model/material');
import ExportMerchant = require('../../../app/model/merchant');
import ExportMessageAdd = require('../../../app/model/message-add');
import ExportMessageNotification = require('../../../app/model/message-notification');
import ExportMessage = require('../../../app/model/message');
import ExportOrder = require('../../../app/model/order');
import ExportPackageMaterial = require('../../../app/model/package-material');
import ExportPackage = require('../../../app/model/package');
import ExportPicCode = require('../../../app/model/picCode');
import ExportProduceGoods = require('../../../app/model/produce-goods');
import ExportProducePackage = require('../../../app/model/produce-package');
import ExportSocketUser = require('../../../app/model/socket-user');
import ExportStaffAuthority = require('../../../app/model/staff-authority');
import ExportStaff = require('../../../app/model/staff');
import ExportUser = require('../../../app/model/user');

declare module 'egg' {
  interface IModel {
    Approve: ReturnType<typeof ExportApprove>;
    Authority: ReturnType<typeof ExportAuthority>;
    Category: ReturnType<typeof ExportCategory>;
    FriendList: ReturnType<typeof ExportFriendList>;
    GoodsPackage: ReturnType<typeof ExportGoodsPackage>;
    GoodsStatus: ReturnType<typeof ExportGoodsStatus>;
    Goods: ReturnType<typeof ExportGoods>;
    GroupMember: ReturnType<typeof ExportGroupMember>;
    Group: ReturnType<typeof ExportGroup>;
    Machine: ReturnType<typeof ExportMachine>;
    MaterialUse: ReturnType<typeof ExportMaterialUse>;
    Material: ReturnType<typeof ExportMaterial>;
    Merchant: ReturnType<typeof ExportMerchant>;
    MessageAdd: ReturnType<typeof ExportMessageAdd>;
    MessageNotification: ReturnType<typeof ExportMessageNotification>;
    Message: ReturnType<typeof ExportMessage>;
    Order: ReturnType<typeof ExportOrder>;
    PackageMaterial: ReturnType<typeof ExportPackageMaterial>;
    Package: ReturnType<typeof ExportPackage>;
    PicCode: ReturnType<typeof ExportPicCode>;
    ProduceGoods: ReturnType<typeof ExportProduceGoods>;
    ProducePackage: ReturnType<typeof ExportProducePackage>;
    SocketUser: ReturnType<typeof ExportSocketUser>;
    StaffAuthority: ReturnType<typeof ExportStaffAuthority>;
    Staff: ReturnType<typeof ExportStaff>;
    User: ReturnType<typeof ExportUser>;
  }
}
