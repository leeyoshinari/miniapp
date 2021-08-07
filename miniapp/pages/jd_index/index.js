//index.js

//获取应用实例
const app = getApp()
import env from "../../env";

Page({
  onShareAppMessage: function() {
    return {
            title: env.TITLE,
            path: '/pages/jd_index/index'
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
    eliteId: "129",
    categorys: [
      {
        text: "精选",
        oid: 8569,
      },
      {
        text: "百货",
        oid: 15,
      },
      {
        text: "女装",
        oid: 14,
      },
      {
        text: "男装",
        oid: 743,
      },
      {
        text: "内衣",
        oid: 1282,
      },
      {
        text: "美妆",
        oid: 16,
      },
      {
        text: "鞋包",
        oid: 1281,
      },
      {
        text: "母婴",
        oid: 4,
      },
      {
        text: "水果",
        oid: 13,
      },
      {
        text: "食品",
        oid: 1,
      },
      {
        text: "家纺",
        oid: 818,
      },
      {
        text: "电器",
        oid: 18,
      },
      /*{
        text: "图书",
        oid: 21888,
      },*/
      {
        text: "文具",
        oid: 2478,
      },
      {
        text: "运动",
        oid: 1451,
      },
      {
        text: "手机",
        oid: 9564,
      },
      {
        text: "数码",
        oid: 9689,
      },
      {
        text: "汽车",
        oid: 2048,
      },
      {
        text: "家装",
        oid: 1917,
      },
      /*{
        text: "家具",
        oid: 2974,
      },*/
      /*{
        text: "虚拟",
        oid: 590,
      },*/
      {
        text: "医药",
        oid: 3279,
      },
    ],
    productions: [],
    request_id: "",
    sortName: "",
    pageIndex: 1,
    sort: "desc"
  },
  gotoSearch: function() {
    wx.navigateTo({
      url: "/pages/jd_search/search"
    });
  },
  gotoStype: function(event) {
    if (event && event.currentTarget.dataset.type) {
      const data_type = event.currentTarget.dataset.type;
      this.setData({eliteId: data_type});
      this.reloadData();
    }
  },
  onPullDownRefresh: function() {
    this.reloadData();
  },
  onReachBottom: function() {
    this.loadNext();
  },
  reloadData() {
    wx.showLoading({
      title: '加载中...',
    })
    this.data.pageIndex = 1;
    wx.cloud.callFunction({
      name: "jdquery",
      data: {
        eliteId: this.data.eliteId,
        pageIndex: this.data.pageIndex,
        sortName: this.data.sortName,
        sort: this.data.sort,
      }
    })
    .then(res => {
      if (res.result._status === 0 && res.result.data && res.result.data.code === 200) {
        const list = res.result.data.data;
        for (var i=0; i<list.length; i++){
          var discount = list[i].couponInfo.couponList;
          if (discount.length > 0){
            var indexof = 0;
            for (var j=0; j<discount.length; j++){
              if (discount[j].isBest === 1){
                indexof = j;
                break;
              }
            }
            list[i].couponInfo.couponList[0] = discount[indexof];
          } 
        }
        this.setData({
          productions: list,
          request_id:  res.result.data.requestId,
          total_count:  res.result.data.totalCount,
        });
      }
      else {
        console.log(res.result._status);
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
      name: "jdquery",
      data: {
        eliteId: this.data.eliteId,
        pageIndex: this.data.pageIndex + 1,
        sortName: this.data.sortName,
        sort: this.data.sort,
      }
    }).then(res => {
      wx.hideLoading();
      if (res.result._status === 0 && res.result.data && res.result.data.code === 200) {
        const list = res.result.data.data;
        this.setData({
          productions: this.data.productions.concat(list),
          request_id:  res.result.data.requestId,
          total_count:  res.result.data.totalCount,
          pageIndex: this.data.pageIndex + 1
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
  changeSortType: function(event) {
    let isChange = false;
    if (event && event.target && event.target.dataset) {
      if (event.target.dataset.type) {
        switch(event.target.dataset.type) {
          case "zh":
            if (this.data.sortName !== "") {
              this.setData({
                sortName: ""
              });
              isChange = true;
            }
            break;
          case "hp":
            if (this.data.sortName !== "goodComments") {
              this.setData({
                sortName: "goodComments"
              });
              isChange = true;
            }
            break;
          case "xl":
            if (this.data.sortName !== "inOrderCount30DaysSku") {
              this.setData({
                sortName: "inOrderCount30DaysSku"
              });
              isChange = true;
            }
            break;
          case "jg":
            if (this.data.sortName !== "price" && this.data.sortName !== 4) {
              this.setData({
                sortName: "price",
                sort: "desc"
              });
              isChange = true;
            } else {
              this.setData({
                sortName: this.data.sortName === 3 ? 4 : 3
              });
              isChange = true;
            }
            break;
          default:
            break;
        }
        if (isChange) {
          this.reloadData();
        }
      }
    }
  },
  onLoad: function () {
    this.reloadData();
  }
})
