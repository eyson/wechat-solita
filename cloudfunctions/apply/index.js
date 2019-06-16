/**
 * 活动报名接口
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
    // 获取微信上下文
    const wxContext = cloud.getWXContext();

    // 获取活动信息
    let post = await db.collection('post').where({
        _id: event.postId
    }).get();
    let postInfo = post.data[0];
    
    console.log(event);
    console.log('apply event data');
    console.log(postInfo);
    console.log('postinfo data');

    // 报名上限
    let applylist = await db.collection('apply').where({
        // openid: wxContext.OPENID,
        postId: event.postId
    }).count();

    // console.log(applylist);
    // 超上限，直接返回
    if (applylist.total == postInfo.maximum){
        return {retcode: 1};
    }

    // 异步写入数据
    return await db.collection('apply').add({
        data: {
            // 活动ID
            postId: event.postId,
            // 姓名
            name: event.name,
            // 备注
            memo: event.memo,
            // 手机号
            mobile: event.mobile ? event.mobile : '',
            // 商品数量
            quantity: event.quantity ? event.quantity : 0,
            // 当前状态
            status: 0,
            // 活动信息 JOSN
            postInfo: postInfo,
            // 用户信息
            nickName: event.nickName,
            avatarUrl: event.avatarUrl,
            city: event.city,
            country: event.country,
            gender: event.gender,
            language: event.language,
            // 创建者 0-非活动创建者,1-活动创建者
            isCreator: event.isCreator ? event.isCreator : 0,
            // OPEN
            openid: event.openid ? event.openid : wxContext.OPENID,
            appid: wxContext.APPID,
            createTime: db.serverDate()
        }
    });
}