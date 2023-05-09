// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const updateResult = await db.collection('CDERelation').where({
      _openId: event.openId,
    })
    .get()
    
    if (updateResult.data.length > 0) {
      return await db.collection('CDERelation').where({
        _openId: event.openId,
      })
        .update({
          data: {
            _openId: event.openId,
            companyId: event.companyId,
            departId: event.departId
          }
        })
    }else{
      return addResult = await db.collection('CDERelation')
        .add({
          data: {
            _openId: event.openId,
            companyId: event.companyId,
            departId: event.departId,
          }
        })
      // if (addResult._id != undefined) {
      //   return {
      //     result: true
      //   }
      // }else{
      //   return {
      //     result: false
      //   }
      // }
    }
  } catch (e) {
    console.error(e)
  }
}