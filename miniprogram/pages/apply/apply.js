/**
 * 报名
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
        postId: '',
        sceneIndex: 0,
        // 保存用户信息
        userInfo: {},
        // 内容大小限制为100字符
        contentSize: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
            sceneIndex: options.sceneIndex
        });

        // console.log(options);

        wx.setNavigationBarTitle({
            title: '报名'
        });

        // 获取用户信息
        wx.getUserInfo({
            lang: 'zh_CN',
            success: this.getUserInfoSuccess
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 提交数据
     */
    bindSubmit: function (e) {
        if (!app.globalData.isLogin) {
            wx.showModal({
                title: '提示',
                content: '报名失败，请先登录'
            });
            return;
        }
        
        // 表单的参数
        let data = e.detail ? e.detail.value : {};
        let userInfo = this.data.userInfo;
        // 活动ID
        data['postId'] = this.data.postId;
        // data['sceneIndex'] = this.data.sceneIndex;
        // 增加用户信息
        data['nickName'] = userInfo.nickName;
        data['avatarUrl'] = userInfo.avatarUrl;
        data['city'] = userInfo['city'];
        data['country'] = userInfo['country'];
        data['gender'] = userInfo['gender'];
        data['language'] = userInfo['language'];
        data['isCreator'] = 0; // 0-非活动创建者,1-活动创建者
        
        console.log(data);
        console.log('call APPLY func data');

        if (!data['name']) {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none'
            });

            return;
        }

        if (parseInt(data['sceneIndex']) === 0 && !data['mobile']) {
            wx.showToast({
                title: '请输入手机号码',
                icon: 'none'
            });

            return;
        }

        if (parseInt(data['sceneIndex']) === 1 && !data['quantity']) {
            wx.showToast({
                title: '请输入商品数量',
                icon: 'none'
            });

            return;
        }

        if(!data['memo']) {
            wx.showToast({
                title: '请填写备注信息',
                icon: 'none'
            });

            return;
        }

        // 全局显示loading
        wx.showLoading({
            title: '提交中...',
        });

        // 调用云函数
        wx.cloud.callFunction({
            name: 'apply',
            data: data
        }).then(res => {
            console.log(res);
            console.log('call APPLY func ok');
            // 隐藏loading
            wx.hideLoading();

            if (res.result.retcode) {
                wx.showModal({
                    title: '提示',
                    content: '已超出报名上限，无法报名'
                });
            }else{
                // 跳到详情页
                wx.navigateBack({
                    delta: 1
                });
            }
        }).catch(err => {
            console.log(err);
            console.log('call APPLY func err');
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '系统异常，请稍后再试'
            });
        })
    },

    /**
     * 计算内容长度
     */
    bindInput: function (e) {
        let v = e.detail ? e.detail.value : '';
        this.setData({
            contentSize: v.length
        });
        // console.log(e);
    },

    /**
     * 获取用户信息
     */
    getUserInfoSuccess: function (res) {
        const userInfo = res.userInfo || {};
        // console.log(userInfo);
        this.setData({
            userInfo: userInfo
        });

        // console.log(this.data.userInfo);
    }
})