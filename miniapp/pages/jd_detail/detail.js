// pages/detail/detail.js
import env from "../../env";
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apikey: "25ee321ae0f7f9be",
    goods_id: "",
    materialId: "",
    detail: null,
    coupon_amount: 0,
    discount: 0,
    inOrderCount30Days: 0,
    price: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.goods_id =  options["gid"];
    this.data.coupon_amount =  options["coupon_amount"];
    this.data.discount =  options["discount"];
    this.data.inOrderCount30Days =  options["inOrderCount30Days"];
    this.data.price =  options["price"];
    this.reloadData();
  },
  formatDate(datetime) {
    try {
      if (datetime * 1) {
        var date = new Date(datetime * 1);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var year = date.getFullYear(),
            month = ("0" + (date.getMonth() + 1)).slice(-2),
            sdate = ("0" + date.getDate()).slice(-2);
        var result = year + "-"+ month +"-"+ sdate;
        return result;
      } else {
        return datetime;
      }
    } catch(err) {
      return datetime;
    }
  },
  reloadData() {
    wx.showLoading({
      title: '加载中...',
    });
    wx.cloud.callFunction({
      name: "jdquery",
      data: {
        detail: true,
        skuIds: this.data.goods_id.toString(),
      }
    })
    .then(res => {
      if (res.result._status === 0 && res.result.data && res.result.data.code === 200) {
        const good_detail = res.result.data.data[0];
        good_detail["coupon_amount"] = this.data.coupon_amount;
        good_detail["discount"] = this.data.discount;
        good_detail["price"] = this.data.price;
        good_detail["inOrderCount30Days"] = this.data.inOrderCount30Days;
        this.setData({
          detail: good_detail,
        });
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }).catch(err => {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    });
  },
  onPullDownRefresh: function() {
    this.reloadData();
  },
  onShareAppMessage: function(e) {
    return {
      title: env.TITLE,
      path: '/pages/jd_index/index',
    };
  },
  onShareTimeline: function (res) {
    return {
      title: env.TITLE,
      query: env.QUERY
    }
  },
  buy() {
    wx.showLoading({
      title: '处理中...',
    });
    wx.cloud.callFunction({
      name: "jdquery",
      data: {
        generate: true,
        apikey: this.data.apikey,
        materialId: this.data.goods_id,
      }
    }).then(res => {
      if (res.result && res.result._status === 0 && res.result.data) {
        const shortURL = res.result.data;
        wx.navigateToMiniProgram({
          appId: "wx91d27dbf599dff74",
          path: "pages/union/proxy/proxy?spreadUrl=" + shortURL,
        });
      wx.stopPullDownRefresh();
      wx.hideLoading();
    } else {
      wx.getClipboardData({
        success (res) {
          wx.showToast({
            title: '领券失败，请刷新后重新尝试',
            icon: 'none',
          })
        },
      })
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }
  }).catch(err => {
      wx.hideLoading();
    });
  },
  gohome() {
    wx.switchTab({
      url: '/pages/jd_index/index',
    });
  },
  tapGallery(){}
})