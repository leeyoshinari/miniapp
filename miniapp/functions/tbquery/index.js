// 云函数入口文件
const cloud = require("wx-server-sdk");
const axios = require("axios");
const utils = require("./tb/utils");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 云函数入口函数
exports.main = async (event, context) => {
  // 默认搜索
  let is_search = true;
  let args = {
    app_key: utils.AppKey,
    adzone_id: utils.PIDLast,
    format: "JSON",
    sort_type: event.sort_type ? event.sort_type : 0,
    timestamp: utils.YYYYMMDDHHmmss(),
    method: "taobao.tbk.dg.optimus.material",
    page_no: event.page_no ? event.page_no : 1,
    v: "2.0",
    sign_method: "md5",
    material_id: event.opt_id,
  };
  // 搜索
  if (event.find) {
    is_search = false;
    args = {
      app_key: utils.AppKey,
      adzone_id: utils.PIDLast,
      format: "JSON",
      timestamp: utils.YYYYMMDDHHmmss(),
      method: "taobao.tbk.dg.material.optional",
      page_no: event.page_no ? event.page_no : 1,
      v: "2.0",
      platform: 2,
      sign_method: "md5",
      q: event.keyword,
    };
    if (event.sort_type) {
      args["sort"] = event.sort_type;
    }
    if (event.has_coupon) {
      args["has_coupon"] = event.has_coupon;
    }
  }
  // 生成淘口令
  if (event.generate) {
    is_search = false;
    args = {
      app_key: utils.AppKey,
      adzone_id: utils.PIDLast,
      format: "JSON",
      timestamp: utils.YYYYMMDDHHmmss(),
      method: "taobao.tbk.tpwd.create",
      v: "2.0",
      sign_method: "md5",
      text: "复制淘口令，打开手机淘宝",
      url: event.coupon_share_url,
    };
  }
  // 详情
  if (event.detail) {
    is_search = false;
    args = {
      app_key: utils.AppKey,
      method: "taobao.tbk.item.info.get",
      platform: 2,
      format: "JSON",
      timestamp: utils.YYYYMMDDHHmmss(),
      v: "2.0",
      sign_method: "md5",
      num_iids: event.num_iids,
    };
  }
  if (event.opt_id) {
    args["opt_id"] = event.opt_id;
  }
  args.sign = utils.sign(args);
  try {
    let result = await axios.get("https://eco.taobao.com/router/rest", {
      params: args,
      headers: {
        "Content-Type": "application/json",
      },
    });
    //console.log(result);
    if (event.find) {
      if (result.data) {
        return {
          _status: 0,
          data: result.data,
        };
      }
    }
    if (event.detail) {
      let r = result.data;
      if (r.tbk_item_info_get_response && r.tbk_item_info_get_response.results) {
        let goods_detail = r.tbk_item_info_get_response.results.n_tbk_item[0];
        return {
          _status: 0,
          data: goods_detail,
        };
      }
    }
    if (is_search) {
      let r = result.data;
      if (r.tbk_dg_optimus_material_response && r.tbk_dg_optimus_material_response.result_list) {
        return {
          _status: 0,
          data: result.data,
        };
      }
    }
    else {
      if (result.data) {
        return {
          _status: 0,
          data: result.data,
        };
      }
    }
    
  } catch (err) {
    return {
      _status: -1,
    };
  }
};
