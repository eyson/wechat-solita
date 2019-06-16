/**
 * 查询报名用户列表接口
 * 
 * @author: eysonyou
 * @create: 2019-05-16
 */


// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    // 1.release - 正式
    // 2.test    - 测试
    // env: 'test'
    env: 'release'
});

// 初始化数据库连接
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    // 查询报名信息，最多1000条
    let apply = await db.collection('apply').where({
        postId: event.postId
    }).orderBy('createTime', 'asc').limit(1000).get();

    // 判断当前用户是否报名
    let myApplyList = apply.data.filter((item) => {
        return item.openid === wxContext.OPENID;
    });

    return {
        event,
        isApply: myApplyList.length ? true : false,
        data: apply.data,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    }
}