// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  var res = {
    companys: [],
    departs: []
  }
  var companyId = 0
  const companyResult = await db.collection('companys')
    .aggregate()
    .match({
      code: companyId
    })
    .project({
      _id: 0,
      code: 1,
      name: 1
    })
    .end()
  const departResult = await db.collection('departs')
    .aggregate()
    .match({
      companyId: companyId
    })
    .project({
      _id:0,
      code:1,
      name:1
    })
    .end()
  res.companys = companyResult.list
  res.departs = departResult.list

  return {
    data: res
  }
}