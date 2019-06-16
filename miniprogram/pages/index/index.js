/**
 * 小程序首页
 * 
 * @author: Eysonyou
 * @create: 2019-05-14
 */
const app = getApp();

Page({

    /**
     * 定义数据对象
     */
    data: {
        // 是否登录
        isLogin: app.globalData.isLogin,
        // 默认为空数据
        isEmpty: true,
        // 我的记录数据集
        resultRows: [],
        openId: ''
    },

    /**
     * 小程序启动时执行
     */
    onLoad: function(options) {
        var that = this;
        // console.log(app.globalData);

        // 当前版本不支持小程序云函数
        if (!wx.cloud) {
            wx.showModal({
                title: '提示',
                content: '微信版本过低，请升级微信'
            });
            return;
        }

        // this.query();

        // 查询授权
        wx.getSetting({
            success: this.getAuthSetting
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.query();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: '圈子报名',
            desc: '圈子里的人都在用',
            path: '/pages/index/index'
        };
    },

    /**
     * 获取授权信息-待删
     */
    getAuthSetting: function(res){
        if (!res.authSetting['scope.userInfo']) {
            // 没有授权
            this.setData({
                isLogin: false
            });
        } else {
            this.setData({
                isLogin: true
            });
        }
    },

    /**
     * 获取用户信息
     */

    bindGetUserInfo: function(event){
        // console.log(event);
        let o = event.detail || {};
        this.setData({
            isLogin: o.userInfo ? true : false
        });

        app.globalData.isLogin = this.data.isLogin;

        if(o.userInfo){
            wx.navigateTo({
                url: '/pages/post/post'
            });
        }
    },

    query: function() {
        // 全局显示loading
        wx.showLoading({
            title: '加载中...',
        });

        // 调用云函数
        wx.cloud.callFunction({
            name: 'index'
        }).then(res => {
            var rows = res.result.data ? res.result.data : [];
            console.log(res);
            console.log('call INDEX func success');
            // 异步回调并更新数据
            this.setData({
                openId: res.result.openid,
                resultRows: rows,
                isEmpty: rows.length > 0 ? false : true
            });

            // console.log(this.data);

            // 隐藏loading
            wx.hideLoading();
        }).catch(err => {
            console.log(err);
            console.log('call INDEX func err');
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '系统异常，请稍后再试'
            });
        });
    }

})