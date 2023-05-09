// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const updateResult = await db.collection('steps').where({
        _openId: event.openId,
        companyId:event.companyId,
      })
      .get()
      
    if(updateResult.data.length > 0)
    {
      return await db.collection('steps').where({
        _openId: event.openId,
        companyId: event.companyId,
      })
      .update({
        data: {
          nickName: event.nickName,
          departId: event.departId,
          steps: event.userData
        }
      })
    }else
    {
      return addResult = await db.collection('steps')
        .add({
          data: {
            _openId: event.openId,
            nickName: event.nickName,
            companyId: event.companyId,
            departId: event.departId,
            steps: event.userData
          }
        })
    }
  } catch (e) {
    console.error(e)
  }
}