// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const updateResult = await db.collection('employees').where({
      _openId: event.openId,
    })
    .get()

    if (updateResult.data.length > 0) {
      db.collection('employees').where({
        _openId: event.openId,
      })
        .update({
          data: {
            name: event.name
          }
        })
      return {
        result: true
      }
    } else {
      const addResult = await db.collection('employees')
        .add({
          data: {
            _openId: event.openId,
            name: event.name
          }
        })
      if (addResult._id != undefined) {
        return {
          result: true
        }
      } else {
        return {
          result: false
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
}