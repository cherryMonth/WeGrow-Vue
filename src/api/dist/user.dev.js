"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePassword = updatePassword;
exports.updateInfo = updateInfo;

var _request = _interopRequireDefault(require("@/utils/request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function updatePassword(params) {
  return (0, _request["default"])({
    url: '/user/updatePassword',
    method: 'post',
    data: params
  });
}

function updateInfo(params) {
  return (0, _request["default"])({
    url: '/user/updateInfo',
    method: 'post',
    data: params
  });
}