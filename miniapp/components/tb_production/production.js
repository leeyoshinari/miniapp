// components/production.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productions: Array,
    good_type: Number,
  },

  attached: function() {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    clickOnProduction: function(event) {
      wx.navigateTo({
        url: '/pages/tb_detail/detail?gid=' + event.currentTarget.dataset.gid + '&coupon_share_url=' + encodeURIComponent('https:' + event.currentTarget.dataset.coupon_share_url) + 
        '&coupon_amount=' + event.currentTarget.dataset.coupon_amount + '&coupon_start_time=' + event.currentTarget.dataset.coupon_start_time + '&coupon_end_time=' + event.currentTarget.dataset.coupon_end_time,
      });
    },

    clickOnBoard: function(event) {
      wx.showModal({
        title: '提示',
        content: '暂不支持查看该商品',
        showCancel: false,
      })
    },
}});
