//index.js

//获取应用实例
import env from "../../env";

const category1 = [{text: "综合",oid: 3756},{text: "女装",oid: 3767},{text: "男装",oid: 3764},{text: "内衣",oid: 3765},{text: "美妆个护",oid: 3763},{text: "鞋包配饰",oid: 3762},{text: "母婴",oid: 3760},{text: "食品",oid: 3761},{text: "家居家装",oid: 3758},{text: "运动户外",oid: 3766},{text: "数码家电",oid: 3759}];
const category2 = [{text: "综合",oid: 9660},{text: "女装",oid: 9658},{text: "男装",oid: 9654},{text: "内衣",oid: 9652},{text: "美妆个护",oid: 9653},{text: "鞋包配饰",oid: 9648},{text: "母婴",oid: 9650},{text: "食品",oid: 9649},{text: "家居家装",oid: 9655},{text: "运动户外",oid: 9651},{text: "数码家电",oid: 9656}];
const category3 = [{text: "综合",oid: 3786},{text: "女装",oid: 3788},{text: "男装",oid: 3790},{text: "内衣",oid: 3787},{text: "美妆个护",oid: 3794},{text: "鞋包配饰",oid: 3796},{text: "母婴",oid: 3789},{text: "食品",oid: 3791},{text: "家居家装",oid: 3792},{text: "运动户外",oid: 3795},{text: "数码家电",oid: 3793}];
const category4 = [{text: "综合",oid: 13366},{text: "女装",oid: 13367},{text: "男装",oid: 13372},{text: "内衣",oid: 13373},{text: "美妆个护",oid: 13371},{text: "鞋包配饰",oid: 13370},{text: "母婴",oid: 13374},{text: "食品",oid: 13375},{text: "家居家装",oid: 13368},{text: "运动户外",oid: 13376},{text: "数码家电",oid: 13369}];

Page({
  onShareAppMessage: function() {
    return {
            title: env.TITLE,
            path: '/pages/tb_index/index'
    }
  },
  onShareTimeline: function (res) {
    return {
      title: env.TITLE,
      query: env.QUERY
    }
  },
  data: {
    env: env,
    s_category_oid: 3756,
    categorys: [],
    productions: [],
    request_id: "",
    search_id: "",
    page_no: 1,
    good_type: 0,
  },
  gotoSearch: function() {
        wx.navigateTo({
            url: "/pages/tb_search/search"
        });
    },
  gotoStype: function(event) {
    //console.log(event);
    if (event && event.currentTarget.dataset.type) {
      const data_type = event.currentTarget.dataset.type;
      if (data_type == 1) {
        this.setData({
            s_category_oid: 3756,
            categorys: category1
        });
          this.reloadData();
        };
      if (data_type == 2) {
        this.setData({
            s_category_oid: 9660,
            categorys: category2
        });
          this.reloadData();
        };
      if (data_type == 3) {
        this.setData({
            s_category_oid: 3786,
            categorys: category3
        });
          this.reloadData();
        };
      if (data_type == 4) {
        this.setData({
            s_category_oid: 13366,
            categorys: category4
        });
          this.reloadData();
        };
    }
  },
  onPullDownRefresh: function() {
    this.reloadData();
  },
  onReachBottom: function() {
    this.loadNext();
  },
  reloadData() {
    wx.pageScrollTo({
      scrollTop: 0
    })
    wx.showLoading({
      title: '加载中...',
    })
    this.data.page = 1;
    wx.cloud.callFunction({
      name: "tbquery",
      data: {
        opt_id: this.data.s_category_oid,
      }
    })
    .then(res => {
      if (res.result && res.result._status === 0 && res.result.data && res.result.data.tbk_dg_optimus_material_response && res.result.data.tbk_dg_optimus_material_response.result_list) {
        const list = res.result.data.tbk_dg_optimus_material_response.result_list.map_data;
        this.setData({
          productions: list,
          request_id:  res.result.data.tbk_dg_optimus_material_response.request_id,
          total_count:  list.length,
        });
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }).catch(err => {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    });
  },
  loadNext() {
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: "tbquery",
      data: {
        sort_type: this.data.sort_type,
        opt_id: this.data.s_category_oid,
        page_no: this.data.page_no + 1,
      }
    }).then(res => {
      wx.hideLoading();
      if (res.result && res.result._status === 0 && res.result.data && res.result.data.tbk_dg_optimus_material_response && res.result.data.tbk_dg_optimus_material_response.result_list) {
        const list = res.result.data.tbk_dg_optimus_material_response.result_list.map_data;
        this.setData({
          productions: this.data.productions.concat(list),
          request_id:  res.result.data.tbk_dg_optimus_material_response.request_id,
          total_count:  list.length,
          page_no: this.data.page_no + 1,
        });
      }
    }).catch(err => {
      wx.hideLoading();
    });
  },
  changeCategoryId: function(event) {
    if (event && event.target && event.target.dataset) {
      if (event.target.dataset.oid) {
        if (this.data.s_category_oid !== event.target.dataset.oid) {
          this.setData({
            s_category_oid: event.target.dataset.oid
          });
          this.reloadData();
        }
      }
    }
  },
  onLoad: function () {
    this.setData({
      s_category_oid: 3756,
      categorys: category1
    });
    this.reloadData();
  }
})
