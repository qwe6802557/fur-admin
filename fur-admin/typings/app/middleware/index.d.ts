// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportToken = require('../../../app/middleware/token');

declare module 'egg' {
  interface IMiddleware {
    token: typeof ExportToken;
  }
}
