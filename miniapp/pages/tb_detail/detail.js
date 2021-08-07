// pages/detail/detail.js
import env from "../../env";
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_id: "",
    coupon_share_url: "",
    detail: null,
    coupon_amount: 0,
    coupon_start_time: "",
    coupon_end_time: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.goods_id =  options["gid"];
    this.data.coupon_share_url = decodeURIComponent(options["coupon_share_url"]);
    this.data.coupon_amount =  options["coupon_amount"];
    this.data.coupon_start_time =  options["coupon_start_time"];
    this.data.coupon_end_time =  options["coupon_end_time"];
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
      name: "tbquery",
      data: {
        detail: true,
        num_iids: this.data.goods_id,
      }
    })
    .then(res => {
      if (res.result && res.result._status === 0 && res.result.data) {
        const good_detail = res.result.data;
        good_detail["coupon_amount"] = this.data.coupon_amount;
        good_detail["coupon_start_time"] = this.formatDate(this.data.coupon_start_time);
        good_detail["coupon_end_time"] = this.formatDate(this.data.coupon_end_time);
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
      path: '/pages/tb_index/index',
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
      name: "tbquery",
      data: {
        generate: true,
        coupon_share_url: this.data.coupon_share_url,
      }
    }).then(res => {
      if (res.result && res.result._status === 0 && res.result.data && res.result.data.tbk_tpwd_create_response && res.result.data.tbk_tpwd_create_response.data) {
        const password_simple = res.result.data.tbk_tpwd_create_response.data.password_simple;
        wx.setClipboardData({
          data: password_simple,
          success (res) {
            wx.getClipboardData({
              success (res) {
                wx.showToast({
                  title: '领券成功，请打开手机淘宝APP领券并购买哟~',
                  icon: 'none',
                })
              },
              fail (res) {
                wx.showToast({
                  title: '领券失败，请重新打开小程序',
                  icon: 'none',
                })
              },
            })
          }
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
      url: '/pages/tb_index/index',
    });
  },
  tapGallery(){}
})