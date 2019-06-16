/**
 * 小程序入口文件
 * 
 * @author: Eysonyou
 * @create: 2019-05-14
 */
App({
    onLaunch: function() {

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                // 1.release - 正式
                // 2.test    - 测试
                // env: 'test',
                env: 'release',
                traceUser: true,
            });
        }

        this.globalData = {};

        // 查询授权
        wx.getSetting({
            success: this.getAuthSetting,
            fail: function(res) {
                console.log('查询授权失败');
            },
            complete: function(res){
                console.log('查询授权完成');
            }
        });
    },

    /**
     * 获取授权信息
     */
    getAuthSetting: function (res) {
        if (!res.authSetting['scope.userInfo']) {
            // 没有授权
            this.globalData.isLogin = false;
        } else {
            this.globalData.isLogin = true;
        }
    },
})