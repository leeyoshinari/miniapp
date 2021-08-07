const CryptoJS = require("crypto-js");
const MD5 = require("crypto-js/md5");

const APPKEY = "3496742e2d5a2fde480d356ec922da1e";
const APPSECRET = "3046bbee1ede4d3583943cbd33c73bf4";
//授权key，有效期一年
//const P_key = "b57733a7028b0901e8bed9ba65eaf6a72d11a7cb858c9d355ec6663158ae2b0c8de117a13926f1c4";
// 推广位PID
const PID = "1002712393_4100329194_3003427429";

function sign(params) {
  var sorted = Object.keys(params).sort();
  var basestring = APPSECRET;
  for (var i = 0, l = sorted.length; i < l; i++) {
    var k = sorted[i];
    basestring += k + params[k];
  }
  basestring += APPSECRET;
  //console.log(basestring);
  return md5(basestring).toUpperCase();
}

function timestamp() {
  return parseInt(new Date().getTime() / 1000);
}

function md5(s) {
  return MD5(s).toString(CryptoJS.enc.Hex);
}

function YYYYMMDDHHmmss(d, options) {
  d = d || new Date().getTime();//+28800000;
  if (!(d instanceof Date)) {
    d = new Date(d);
  }

  var dateSep = "-";
  var timeSep = ":";
  if (options) {
    if (options.dateSep) {
      dateSep = options.dateSep;
    }
    if (options.timeSep) {
      timeSep = options.timeSep;
    }
  }
  var date = d.getDate();
  if (date < 10) {
    date = "0" + date;
  }
  var month = d.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  var hours = d.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  var mintues = d.getMinutes();
  if (mintues < 10) {
    mintues = "0" + mintues;
  }
  var seconds = d.getSeconds();
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return (
    d.getFullYear() +
    dateSep +
    month +
    dateSep +
    date +
    " " +
    hours +
    timeSep +
    mintues +
    timeSep +
    seconds
  );
}

module.exports = {
  md5,
  YYYYMMDDHHmmss,
  sign,
  timestamp,
  APPKEY,
  APPSECRET,
  PID,
};
