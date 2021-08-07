// components/production.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productions: Array,
  },

  attached: function() {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    clickOnProduction: function(event) {
      wx.navigateTo({
        url: '/pages/jd_detail/detail?gid=' + event.currentTarget.dataset.gid + '&discount=' + event.currentTarget.dataset.discount +
        '&inOrderCount30Days=' + event.currentTarget.dataset.inordercount30days + '&price=' + event.currentTarget.dataset.price,
      });
    },
  }
})
