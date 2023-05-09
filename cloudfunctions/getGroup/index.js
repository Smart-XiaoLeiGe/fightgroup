// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    var res = {
      companyName: "",
      companyId: -1,
      departName: "",
      companyId: -1,
    }
    const result = await db.collection('CDERelation')
      .aggregate()
      .match({
        _openId: event.openId
      })
      .project({
        _id: 0,
        companyId: 1,
        departId: 1
      })
      .end()
    if (result.list.length > 0) {
      var companyId = parseInt(result.list[0].companyId)
      var departId = parseInt(result.list[0].departId)
      res.companyId = companyId
      res.departId = departId
      const companyResult = await db.collection('companys')
        .aggregate()
        .match({
          code: companyId
        })
        .project({
          _id: 0,
          name: 1
        })
        .end()
      const departResult = await db.collection('departs')
        .aggregate()
        .match({
          code: departId
        })
        .project({
          _id: 0,
          name: 1
        })
        .end()
      res.companyName = companyResult.list[0].name
      res.departName = departResult.list[0].name
    }
    return {
      data: res
    }
  }
  catch (e) {
    console.error(e)
  }
}