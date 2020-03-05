/**
 * 针对图片做敏感图鉴定
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

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();

    // 从云存储下载文件
    const ret = await cloud.downloadFile({
        fileID: event.fileID
    });

    const buffer = ret.fileContent;
    console.log(event);
    const result = await cloud.openapi.security.imgSecCheck({
        media: {
            contentType: event.contentType,
            value: buffer
        }
    }).then(res => {
        return res;
    }).catch(err => {
        return err;
    });

    return result;
}