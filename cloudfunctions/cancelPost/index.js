/**
 * 取消活动接口，不删除数据
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

    // 更新活动信息 - 结束
    let post = await db.collection('post').where({
        _id: event.postId,
        openid: wxContext.OPENID
    }).update({
        data: {
            // 1-活动结束，0-活动开始
            status: 1
        }
    });

    // 查询活动信息
    let postInfo = await db.collection('post').where({
        _id: event.postId,
        openid: wxContext.OPENID
    }).get();

    // 同时修改报名记录里的状态
    let applyUpdate = await db.collection('apply').where({
        postId: event.postId
    }).update({
        data: {
            postInfo: postInfo.data[0]
        }
    });

    return {
        event,
        data: post,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    }
}