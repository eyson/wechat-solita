/**
 * 发布接龙接口
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
exports.main = async(event, context) => {
    // 获取微信上下文
    const wxContext = cloud.getWXContext();

    // 参数
    let params = {
        // 标题
        title: event.title,
        // 内容
        content: event.content,
        // 场景
        sceneIndex: event.sceneIndex, // 0-活动，1-拼团
        // 当场景为1时才有（拼团专用字段）
        amount: event.amount ? event.amount : 0,
        // 当前状态
        // 0 - 正常
        // 1 - 结束
        status: 0,
        // 报名上限
        maximum: event.maximum ? event.maximum : 1000,
        // 用户信息
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        city: event.city,
        country: event.country,
        gender: event.gender,
        language: event.language,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        createTime: db.serverDate()
    };

    // 异步写入数据
    let post = await db.collection('post').add({
        data: params
    });

    // 活动ID
    let postId = post._id;

    // 创建活动时自动为创建者报名
    let apply = await cloud.callFunction({
        name: 'apply',
        data: {
            // 活动ID
            postId: postId,
            // 姓名
            name: params.nickName,
            // 备注
            memo: '报名 +1',
            // 手机号
            mobile: '',
            // 商品数量
            quantity: 1,
            // 当前状态
            status: 0,
            // 活动信息 JOSN
            postInfo: params,
            // 用户信息
            nickName: params.nickName,
            avatarUrl: params.avatarUrl,
            city: params.city,
            country: params.country,
            gender: params.gender,
            language: params.language,
            isCreator: 1,
            openid: wxContext.OPENID
        }
    }).then(res => {
        console.log('ok');
        return res;
    }).catch(err => {
        console.log(err);
        return err;``
    });

    return post;
}