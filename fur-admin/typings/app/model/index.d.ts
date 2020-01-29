// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCategory = require('../../../app/model/category');
import ExportFriendList = require('../../../app/model/friend-list');
import ExportGoods = require('../../../app/model/goods');
import ExportList = require('../../../app/model/list');
import ExportMessageAdd = require('../../../app/model/message-add');
import ExportMessageNotification = require('../../../app/model/message-notification');
import ExportMessage = require('../../../app/model/message');
import ExportOrders = require('../../../app/model/orders');
import ExportPrivilege = require('../../../app/model/privilege');
import ExportRolePrivilege = require('../../../app/model/role-privilege');
import ExportRole = require('../../../app/model/role');
import ExportSocketUser = require('../../../app/model/socket-user');
import ExportSpends = require('../../../app/model/spends');
import ExportUserRole = require('../../../app/model/user-role');
import ExportUser = require('../../../app/model/user');
import ExportWoodStandard = require('../../../app/model/wood-standard');

declare module 'egg' {
  interface IModel {
    Category: ReturnType<typeof ExportCategory>;
    FriendList: ReturnType<typeof ExportFriendList>;
    Goods: ReturnType<typeof ExportGoods>;
    List: ReturnType<typeof ExportList>;
    MessageAdd: ReturnType<typeof ExportMessageAdd>;
    MessageNotification: ReturnType<typeof ExportMessageNotification>;
    Message: ReturnType<typeof ExportMessage>;
    Orders: ReturnType<typeof ExportOrders>;
    Privilege: ReturnType<typeof ExportPrivilege>;
    RolePrivilege: ReturnType<typeof ExportRolePrivilege>;
    Role: ReturnType<typeof ExportRole>;
    SocketUser: ReturnType<typeof ExportSocketUser>;
    Spends: ReturnType<typeof ExportSpends>;
    UserRole: ReturnType<typeof ExportUserRole>;
    User: ReturnType<typeof ExportUser>;
    WoodStandard: ReturnType<typeof ExportWoodStandard>;
  }
}
