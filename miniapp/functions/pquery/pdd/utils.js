const CryptoJS = require("crypto-js");
const MD5 = require("crypto-js/md5");

// 拼多多应用client_secret
const SECRET = "2440d8f47d626bb837e4ea3f2920d3966ec37726";
// 拼多多应用client_id
const CLIENTID = "ed3db9f07b2a4476bddb07a223c6d68e";
// 拼多多推广位PID
const PDDPID = "15084399_190061927";
const custom_parameters = '{"uid":"15084399_190061927"}';

function sign(params) {
  var sorted = Object.keys(params).sort();
  var basestring = SECRET;
  for (var i = 0, l = sorted.length; i < l; i++) {
    var k = sorted[i];
    basestring += k + params[k];
  }
  basestring += SECRET;
  //console.log("basestring ==>", basestring);
  return md5(basestring).toUpperCase();
}

function timestamp() {
  return parseInt(new Date().getTime() / 1000);
}

function md5(s) {
  return MD5(s).toString(CryptoJS.enc.Hex);
}

function YYYYMMDDHHmmss(d, options) {
  d = d || new Date();
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
  CLIENTID,
  PDDPID,
  custom_parameters,
};
