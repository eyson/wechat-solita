/**
 * 详情
 * 
 * @author: Eysonyou
 * @create: 2019-05-14
 */

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 当前用户是否报名了
        isApply: false,
        // 是否是创建者
        isCreator: false,
        // 是否限制
        isLimit: false,
        // 活动ID
        postId: '',
        // 是否已经授权登录
        isLogin: app.globalData.isLogin,
        // 详情数据是否为空
        isEmpty: true,
        // 详情
        detail: {},
        // 图片列表
        fileList: [],
        // 报名用户列表
        userList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 当前版本不支持小程序云函数
        if (!wx.cloud) {
            wx.showModal({
                title: '提示',
                content: '微信版本过低，请升级微信'
            });
            return;
        }

        this.setData({
            postId: options.id,
            isCreator: options.isCreator || false,
            detail: {
                title: '...',
                maximum: 1000,
                sceneIndex: options.sceneIndex || 0,
                content: '...',
                amount: 0,
                status: options.status || 0,
                createTime: '0000-00-00T00:00:00.000'
            }
        });

        wx.setNavigationBarTitle({
            title: '详情'
        });

        // 查询授权
        wx.getSetting({
            success: this.getAuthSetting
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.query();
        this.getApplyList();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let pages = getCurrentPages();
        let page = pages[pages.length - 1];
        let options = page.options;
        // console.log(page);
        let title = this.data.detail.title;
        let type = this.data.detail.sceneIndex == 0 ? '活动' : '拼团';
        return {
            title: `${type} | ${title}`,
            desc: '',
            path: `/${page.route}?id=${options.id}`
        };
    },

    /**
     * 获取授权信息
     */
    getAuthSetting: function (res) {
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
    bindGetUserInfo: function (event) {
        // console.log(event);
        let o = event.detail || {};
        this.setData({
            isLogin: o.userInfo ? true : false,
            userInfo: o.userInfo ? o.userInfo : {}
        });

        app.globalData.isLogin = true;
    },

    /**
     * 查询详情
     */
    query: function() {
        // 全局显示loading
        wx.showLoading({
            title: '加载中...',
        });

        // 调用云函数
        wx.cloud.callFunction({
            name: 'detail',
            data: {
                id: this.data.postId
            }
        }).then(res => {
            var rows = res.result.data ? res.result.data : [];
            console.log(res);
            console.log('call DETAIL func ok');
            // 异步回调并更新数据
            this.setData({
                detail: rows[0],
                isCreator: res.result.isCreator,
                isEmpty: rows.length > 0 ? false : true
            });

            // 下载图片
            if (rows[0] && rows[0].fileID){
                wx.cloud.getTempFileURL({
                    fileList: [rows[0].fileID],
                    success: res => {
                        console.log(res);

                        // 保存图片
                        this.setData({
                            fileList: res.fileList
                        });
                    }
                });
            }

            // 隐藏loading
            wx.hideLoading();
        }).catch(err => {
            console.log(err);
            console.log('call DETAIL func err');
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '系统异常，请稍后再试'
            });
        });
    },

    /**
     * 查询报名用户列表
     */
    getApplyList: function () {
        var that = this;
        // 全局显示loading
        wx.showLoading({
            title: '加载中...',
        });

        // 调用云函数
        wx.cloud.callFunction({
            name: 'getApplyList',
            data: {
                postId: that.data.postId
            }
        }).then(res => {
            var rows = res.result.data ? res.result.data : [];
            console.log(res);
            console.log('call GETAPPLYLIST func ok');
            // 异步回调并更新数据
            this.setData({
                userList: rows,
                isApply: res.result.isApply
            });

            // 隐藏loading
            wx.hideLoading();
        }).catch(err => {
            console.log(err);
            console.log('call GETAPPLYLIST func err');
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '系统异常，请稍后再试'
            });
        });
    },

    /**
     * 取消报名
     */
    cancelApply: function(){
        var that = this;
        // 全局显示loading
        wx.showLoading({
            title: '提交中...',
        });

        // 调用云函数
        wx.cloud.callFunction({
            name: 'cancelApply',
            data: {
                postId: that.data.postId
            }
        }).then(res => {
            console.log(res);
            console.log('call CANCELAPPLY func ok');
            that.getApplyList();
            // 隐藏loading
            wx.hideLoading();
        }).catch(err => {
            console.log(err);
            console.log('call CANCELAPPLY func err');
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '系统异常，请稍后再试'
            });
        });
    },

    /**
     * 关闭活动
     */
    cancelPost: function () {
        var that = this;
        // 全局显示loading
        wx.showLoading({
            title: '提交中...',
        });

        // 调用云函数
        wx.cloud.callFunction({
            name: 'cancelPost',
            data: {
                postId: that.data.postId
            }
        }).then(res => {
            console.log(res);
            console.log('call CANCELPOST func ok');
            that.query();
            // 隐藏loading
            wx.hideLoading();
        }).catch(err => {
            console.log(err);
            console.log('call CANCELPOST func err');
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '系统异常，请稍后再试'
            });
        });
    },
    /**
     * 标记为完成
     */
    confirm: function (event) {
        let id = event.currentTarget.dataset.id;
        let that = this;
        wx.showModal({
            title: '提示',
            content: '将记录标记为「完成」？',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    console.log('用户点击主操作');
                    that.updateApply(id, 1);
                } else {
                    console.log('用户点击辅助操作');
                }
            }
        });

    },
    /**
     * 取消标记完成
     */
    cancel: function(event) {
        let id = event.currentTarget.dataset.id;
        let that = this;
        wx.showModal({
            title: '提示',
            content: '将记录标记为「未完成」？',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    console.log('用户点击主操作');
                    that.updateApply(id, 0);
                } else {
                    console.log('用户点击辅助操作');
                }
            }
        });
    },
    /**
     * 更新报名状态
     */
    updateApply: function(id, status) {
        var that = this;
        // 全局显示loading
        wx.showLoading({
            title: '提交中...',
        });

        // 调用云函数
        wx.cloud.callFunction({
            name: 'updateApply',
            data: {
                id: id,
                status: status
            }
        }).then(res => {
            console.log(res);
            console.log('call updateApply func ok');
            that.getApplyList();
            // 隐藏loading
            wx.hideLoading();
        }).catch(err => {
            console.log(err);
            console.log('call updateApply func err');
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '系统异常，请稍后再试'
            });
        });
    }
})