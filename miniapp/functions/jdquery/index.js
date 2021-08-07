// 云函数入口文件
const cloud = require("wx-server-sdk");
const axios = require("axios");
const utils = require("./jd/utils");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 云函数入口函数
exports.main = async (event, context) => {
  // 默认搜索
  let is_search = true;
  let args = {
    app_key: utils.APPKEY,
    format: "JSON",
    timestamp: utils.YYYYMMDDHHmmss(),
    method: "jd.union.open.goods.jingfen.query",
    v: "1.0",
    sign_method: "md5",
    param_json: '{"goodsReq": {"eliteId":' + event.eliteId +',"pageIndex":'+event.pageIndex+',"pid":"'+utils.PID+'","sort":"'+ event.sort+'","sortName":"'+ event.sortName+'"}}'
  };
  // 搜索
  /*param_json: JSON.stringify({"goodsReq": {
      "eliteId": event.eliteId, 
      "pageIndex": event.pageIndex,
      "pid": utils.PID,
      "sort": event.sort,
      "sortName": event.sortName,
    }})
  if (event.find) {
    is_search = false;
    args = {
      apikey: event.apikey,
      page_no: event.page_no ? event.page_no : 1,
      keyword: event.keyword,
    };
    if (event.sort_type) {
      args["sort"] = event.sort_type;
    }
    if (event.has_coupon) {
      args["has_coupon"] = event.has_coupon;
    }
  }*/
  if (event.generate) {
    args = {
      apikey: event.apikey,
      goods_id: event.materialId,
      unionId: 1002712393,
      type: 1,
      positionid: 3003427429,
    };
    let result = await axios.get("http://api-gw.haojingke.com/index.php/v1/api/jd/getunionurl", {
      params: args,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.data && result.data.data) {
      return {
        _status: 0,
        data: result.data.data
      };
    } else {
      return {
        _status: 1,
      };
    }
  }
  // 详情
  if (event.detail) {
    is_search = false;
    args = {
      app_key: utils.APPKEY,
      method: "jd.union.open.goods.bigfield.query",
      format: "JSON",
      timestamp: utils.YYYYMMDDHHmmss(),
      v: "1.0",
      sign_method: "md5",
      param_json: JSON.stringify({"goodsReq": {
        "skuIds": [event.skuIds]}})
      };
  }
  if (event.opt_id) {
    args["opt_id"] = event.opt_id;
  }

  args.sign = utils.sign(args);
  if (event.find) {
    args = {
      apikey: event.apikey,
      pageindex: event.pageIndex ? event.pageIndex : 1,
      keyword: event.keyword,
      sort: event.sort,
      sortname: event.sortname,
      ispg: "0",
      iscoupon: event.has_coupon,
      isunion: "1",
    };
    let result = await axios.get("http://api-gw.haojingke.com/index.php/v1/api/jd/goodslist", {
      params: args,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.data) {
      return {
        _status: 0,
        data: result.data.data.data
      };
    }
  } else {
  try {
    let result = await axios.get("https://router.jd.com/api", {
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
          data: JSON.parse(result.data.jd_union_open_goods_bigfield_query_response.result),
        };
      }
    }
    if (event.detail) {
      let r = result.data;
      if (r.jd_union_open_goods_bigfield_query_response && r.jd_union_open_goods_bigfield_query_response.result) {
        return {
          _status: 0,
          data: JSON.parse(result.data.jd_union_open_goods_bigfield_query_response.result),
        };
      }
    }
    if (is_search) {
      let r = result.data;
      if (r.jd_union_open_goods_jingfen_query_response && r.jd_union_open_goods_jingfen_query_response.result) {
        return {
          _status: 0,
          data: JSON.parse(r.jd_union_open_goods_jingfen_query_response.result),
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
      data: err
    };
  }
}
};
