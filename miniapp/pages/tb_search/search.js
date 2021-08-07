// pages/tb_search/search.js
import env from "../../env";
const blacklist = ["ios", "苹果账号", "苹果游戏", "qq"];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchVal: "",
    historys: [],
    productions: [],
    request_id: "",
    sort_type: "",
    page_no: 1,
    has_coupon: false
  },
  onlyFilterChange: function(e) {
    this.setData({
      filterYH: e.detail.value,
    });
    this.reloadData();
  },
  onTapHistory: function(e) {
    this.data.searchVal = e.currentTarget.dataset.val;
    this.setData({
      searchVal: this.data.searchVal,
    });
    this.reloadData();
  },
  bindKeyInput: function (e) {
    this.setData({
      searchVal: e.detail.value
    })
  },
  clearSearchContent: function() {
    wx.setStorageSync('historys', JSON.stringify([]));
    this.reloadHistory();
  },
  searchContent: function() {
    if (!this.data.searchVal || this.data.searchVal.trim() === "") {
      this.setData({
        productions: [],
      });
      return;
    }
    let hs = [this.data.searchVal.trim()];
    for (let h of this.data.historys) {
      if (h !== this.data.searchVal) {
        hs.push(h);
      }
      if (hs.length === 0) {
        break;
      }
      if (hs.length > 5) {
        hs = hs.slice(0, 6);
      }
    }
    wx.setStorageSync('historys', JSON.stringify(hs));
    this.reloadHistory();
    this.reloadData();
  },
  reloadHistory: function() {
    try {
      var historys = wx.getStorageSync('historys')
      if (historys) {
        this.setData({
          historys: JSON.parse(historys)
        });
      }
    } catch (e) {
    }
  },
  onPullDownRefresh: function() {
    this.reloadHistory();
    this.reloadData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  onReachBottom: function() {
    this.loadNext();
  },
  reloadData() {
    wx.pageScrollTo({
      scrollTop: 0
    })
    if (!this.data.searchVal || this.data.searchVal.trim() === "") {
      wx.stopPullDownRefresh();
      return;
    }
    if (blacklist.indexOf(this.data.searchVal.trim().toLowerCase()) > -1 || this.data.searchVal.trim().toLowerCase().indexOf("ios") > -1) {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '搜索不到相关的商品',
        showCancel: false,
      });
      this.setData({
        productions: [],
      });
      return;
    }
    wx.showLoading({
      title: '加载中...',
    })
    this.data.page_no = 1;
    wx.cloud.callFunction({
      name: "tbquery",
      data: {
        find: true,
        keyword: this.data.searchVal.trim(),
        sort_type: this.data.sort_type,
        has_coupon: this.data.has_coupon
      }
    })
   .then(res => {
      if (res.result && res.result._status === 0 && res.result.data && res.result.data.tbk_dg_material_optional_response && res.result.data.tbk_dg_material_optional_response.result_list) {
        wx.stopPullDownRefresh();
        const list = res.result.data.tbk_dg_material_optional_response.result_list.map_data;
        if (list.length === 0) {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '搜索不到相关的商品',
            showCancel: false,
          });
          this.setData({
            productions: [],
          });
          return;
        }
        this.setData({
          productions: list,
          request_id:  res.result.data.tbk_dg_material_optional_response.request_id,
          total_count:  list.length,
        });
      } else {
        wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '搜索不到相关的商品',
            showCancel: false,
          });
          this.setData({
            productions: [],
          });
          return;
      }
      wx.hideLoading();
    }).catch(err => {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    });
  },
  loadNext() {
    if (!this.data.searchVal || this.data.searchVal.trim() === "") {
      return;
    }
    wx.showLoading({
      title: '加载中...',
    });
    wx.cloud.callFunction({
      name: "tbquery",
      data: {
        find: true,
        keyword: this.data.searchVal.trim(),
        page_no: this.data.page_no + 1,
        sort_type: this.data.sort_type,
        has_coupon: this.data.has_coupon
      }
    }).then(res => {
      wx.hideLoading();
      if (res.result && res.result._status === 0 && res.result.data && res.result.data.tbk_dg_material_optional_response && res.result.data.tbk_dg_material_optional_response.result_list) {
        const list = res.result.data.tbk_dg_material_optional_response.result_list.map_data;
        this.setData({
          request_id:  res.result.data.tbk_dg_material_optional_response.request_id,
          total_count:  list.length,
          productions: this.data.productions.concat(list),
          page_no: this.data.page_no + 1,
        });
      }
    }).catch(err => {
      wx.hideLoading();
    });
  },
  changeSortType: function(event) {
    let isChange = false;
    if (event && event.target && event.target.dataset) {
      if (event.target.dataset.type) {
        switch(event.target.dataset.type) {
          case "match":
            if (this.data.sort_type !== "match_des") {
              this.setData({
                sort_type: "match_des"
              });
              isChange = true;
            }
            break;
          case "total_sales":
            if (this.data.sort_type !== "total_sales_des") {
              this.setData({
                sort_type: "total_sales_des"
              });
              isChange = true;
            }
            break;
          case "zh":
            if (this.data.sort_type !== '') {
              this.setData({
                sort_type: ""
              });
              isChange = true;
            }
            break;
          case "price":
            if (this.data.sort_type !== "price_asc" && this.data.sort_type !== "price_des") {
              this.setData({
                sort_type: "price_asc"
              });
              isChange = true;
            } else {
              this.setData({
                sort_type: this.data.sort_type === "price_asc" ? "price_des" : "price_asc"
              });
              isChange = true;
            }
            break;
            case "yh":
              if (this.data.has_coupon) {
                this.data.has_coupon = false;
                this.setData({
                  yh_type: ""
                });
              } else {
                this.data.has_coupon = true;
                this.setData({
                  yh_type: "yh"
                })
              }
              isChange = true;
              break;
          default:
            this.setData({
              sort_type: ""
            });
            isChange = true;
            break;
        }
        if (isChange) {
          this.reloadData();
        }
      }
    }
  },
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
  onLoad: function () {
    this.reloadHistory();
  },
})