/**
 * 发布
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
        // 保存用户信息
        userInfo: {},
        // 内容大小限制为200字符
        contentSize: 0,
        // 场景集合
        scenes: ["活动", "拼团"],
        // 默认的场景
        sceneIndex: 0,
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

        wx.setNavigationBarTitle({
            title: '发起'
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
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

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

    },

    /**
     * 选择场景
     */
    bindSceneChange: function(e) {
        // console.log('Scenes:', e.detail.value);

        this.setData({
            sceneIndex: e.detail.value
        })
    },
    
    /**
     * 提交数据
     */
    bindSubmit: function(e){
        if(!app.globalData.isLogin) {
            wx.showModal({
                title: '提示',
                content: '发布失败，请先登录'
            });
            return;
        }
        let data = e.detail ? e.detail.value : {};
        let userInfo = this.data.userInfo;
        // 增加用户信息
        data['nickName'] = userInfo.nickName;
        data['avatarUrl'] = userInfo.avatarUrl;
        data['city'] = userInfo['city'];
        data['country'] = userInfo['country'];
        data['gender'] = userInfo['gender'];
        data['language'] = userInfo['language'];
        console.log(data);
        console.log('post submit data');

        if (data['maximum'] < 0 || data['maximum'] > 1000){
            wx.showToast({
                title: '超出报名上限（1~1000）',
                icon: 'none'
            });

            return;
        }

        if(!data['title']) {
            wx.showToast({
                title: data['sceneIndex'] == 0 ? '请输入活动主题' : '请输入商品名称',
                icon: 'none'
            });

            return;
        }

        if (parseInt(data['sceneIndex']) === 1 && !data['amount']) {
            wx.showToast({
                title: '请输入商品价格',
                icon: 'none'
            });

            return;
        }

        if (!data['content']) {
            wx.showToast({
                title: data['sceneIndex'] == 0 ? '请输入活动内容' : '请输入商品描述',
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
            name: 'post',
            data: data
        }).then(res => {
            console.log(res);
            console.log('post POST func success');
            // 隐藏loading
            wx.hideLoading();
            
            // 跳到详情页
            wx.redirectTo({
                url: `/pages/detail/detail?id=${res.result._id}`,
            });
        }).catch(err => {
            console.log(err);
            console.log('post POST func err');
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
    bindInput: function(e){
        let v = e.detail ? e.detail.value : '';
        this.setData({
            contentSize: v.length
        });
        // console.log(e);
    },

    /**
     * 获取用户信息
     */
    getUserInfoSuccess: function(res){
        const userInfo = res.userInfo || {};
        // console.log(userInfo);
        this.setData({
            userInfo: userInfo
        });

        // console.log(this.data.userInfo);
    }
})