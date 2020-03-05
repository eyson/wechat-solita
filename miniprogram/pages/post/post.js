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
        // 图片上传限制
        imgUploadMax: 1,
        // 解决textarea组件在表单提交时无法获取内容的BUG
        content: '',
        // 保存用户信息
        userInfo: {},
        // 内容大小限制为200字符
        contentSize: 0,
        // 场景集合
        scenes: ["活动", "拼团"],
        // 默认的场景
        sceneIndex: 0,
        // 上传文件-文件列表
        files: [],
        fileID: ''
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
            sceneIndex: e.detail.value,
            fileID: ''
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
        // 解决textarea组件在表单提交时无法获取内容的BUG
        data.content = this.data.content;

        // 图片
        data['fileID'] = this.data.fileID;

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
            content: v,
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
    },

    /**
     * 选择图片
     */
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            // 只能上传一张
            count: that.imgUploadMax,
            // 可以指定是原图还是压缩图，默认二者都有
            sizeType: ['original', 'compressed'],
            // 可以指定来源是相册还是相机，默认二者都有
            sourceType: ['album', 'camera'], 
            success: function (res) {
                wx.showLoading({
                    title: '图片上传中...',
                });

                let filePath = res.tempFilePaths[0];

                // 返回选定照片的本地文件路径列表
                // tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    // 只能上传一张，每次会覆盖
                    files: res.tempFilePaths
                    // files: that.data.files.concat(res.tempFilePaths)
                });
                // console.log(res);
                // console.log(that.data.files);
                
                
                // get file EXT,for .jpg
                let ext = filePath.match(/\.[^.]+?$/)[0];
                let sceneIndex = that.data.sceneIndex;
                let time = (new Date()).getTime();
                let rand = parseInt(Math.random() * 100000);
                let cloudPath = `img_${sceneIndex}_${time}_${rand}${ext}`;
                console.log(cloudPath);
                wx.cloud.uploadFile({
                    cloudPath: cloudPath,
                    filePath: filePath,
                    success: function(res){
                        // 图片上传成功
                        console.log(res);
                        that.setData({
                            fileID: res.fileID
                        });

                        // 鉴定敏感图片
                        let contentType = ext.replace(/\./g, '');
                        console.log(contentType);
                        wx.cloud.callFunction({
                          name: 'imgSecCheck',
                          data: {
                            contentType: 'image/png',
                            fileID: res.fileID
                          }
                        }).then(res => {
                          // 图片上传成功
                        }).catch(err => {
                          // 敏感图片，清空参数值
                          that.setData({
                            fileID: '',
                            files: []
                          });
                          wx.showModal({
                            title: '提示',
                            content: '图片上传失败'
                          });
                        });
                    },
                    fail: function(e){
                        // todo
                        console.log(e);
                    },
                    complete: function(){
                        wx.hideLoading();
                    }
                });
            },
            fail: function(e){
                console.log('----upload fail----');
                console.log(e);
            },
            complete: function(res){
                wx.hideLoading();
            }
        })
    },
    
    /**
     * 预览图片
     * todo: 待完善删除功能
     */
    previewImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        });
    }
})