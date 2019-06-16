/**
 * 取消报名接口
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
    const wxContext = cloud.getWXContext();

    // 消息报名
    let apply = await db.collection('apply').where({
        postId: event.postId,
        openid: wxContext.OPENID
    }).remove();

    return {
        event,
        data: apply.data,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    }
}