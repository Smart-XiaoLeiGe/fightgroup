// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  var res = {
    "personStep":0,
    "personWeekSum":0,
    "personWeekAvg":0,
    "personMonthSum":0,
    "personMonthAvg":0,
    "departTodayStepSum":0,
    "departTodayStepAvg":0,
    "departTodayStepRank":0,
    "departWeekStepSum":0,
    "departWeekStepAvg":0,
    "departWeekStepRank":0,
    "departMonthStepSum":0,
    "departMonthStepAvg":0,
    "departMonthStepRank":0,
    "companyTodayStepSum":0,
    "companyTodayStepAvg":0,
    "companyTodayStepDepartAvgRank":0,
    "companyTodayStepPersonSumRank":0,
    "companyWeekStepSum":0,
    "companyWeekStepAvg":0,
    "companyWeekStepDepartAvgRank":0,
    "companyWeekStepPersonSumRank":0,
    "companyMonthStepSum":0,
    "companyMonthStepAvg":0,
    "companyMonthStepDepartAvgRank":0,
    "companyMonthStepPersonSumRank": 0,
  }
  try {
    const limitResult = await db.collection('steps')
      .aggregate()
      .match({
        _openId: event.openId,
        companyId: event.companyId,
        departId: event.departId,
      })
      .unwind({
        path: '$steps',
        includeArrayIndex: 'index',
        preserveNullAndEmptyArrays: true
      })
      .sort({
        'steps.timestamp': 1
      })
      .group({
        _id: null,
        testLimit: $.last('$steps.timestamp')
      })
      .project({
        limitMonth: $.dayOfMonth($.dateFromString({
          dateString: '$testLimit'
        })),
        limitWeek: $.dayOfWeek($.dateFromString({
          dateString: '$testLimit'
        }))
      })
      .end()

    var limitMonth = limitResult.list[0].limitMonth
    var limitWeek = limitResult.list[0].limitWeek
    if(limitWeek==1){
      limitWeek = 7
    }else{
      limitWeek = limitWeek-1
    }

    const companyResult = await db.collection('CDERelation')
      .aggregate()
      .match({
        companyId: event.companyId,
      })
      .group({
        _id: '$_openId'
      })
      .end()
    var companyPersonCount = companyResult.list.length

    const orgResult = await db.collection('CDERelation')
      .aggregate()
      .match({
        companyId: event.companyId,
      })
      .group({
        _id: '$departId',
        openIds: $.push('$_openId')
      })
      .end()
    
    res.departInfos = orgResult.list;
    var departsCount = orgResult.list
    var myDepartInfo = departsCount.find(function(item){
       return item._id == event.departId
    })
    var myDepartMemberCount = myDepartInfo.openIds.length
    

    var todayStartTime;
    var weekStartTime;
    var monthStartTime;
    
    //个人
    {
      const todayPersonResult = await db.collection('steps')
        .aggregate()
        .match({
          _openId: event.openId,
          companyId: event.companyId,
          departId: event.departId,
        })
        .unwind({
          path: '$steps',
          includeArrayIndex: 'index',
          preserveNullAndEmptyArrays: true
        })
        .sort({
          'steps.timestamp': -1
        })
        .limit(1)
        .project({
          _id: 0,
          todayStartTime: '$steps.timestamp',
          personStep: '$steps.step'
        })
        .end()
      if (todayPersonResult.list.length > 0) {
        todayStartTime = todayPersonResult.list[0].todayStartTime
        res.personStep = todayPersonResult.list[0].personStep
      }
      const weekPersonResult = await db.collection('steps')
        .aggregate()
        .match({
          _openId: event.openId,
          companyId: event.companyId,
          departId: event.departId,
        })
        .unwind({
          path: '$steps',
          includeArrayIndex: 'index',
          preserveNullAndEmptyArrays: true
        })
        .sort({
          'steps.timestamp': -1
        })
        .limit(limitWeek)
        .group({
          _id: null,
          weekSteps: $.push('$steps.step'),
          weekStartTime: $.last('$steps.timestamp'),
          personWeekSum: $.sum('$steps.step'),
          personWeekAvg: $.avg('$steps.step'),
          personWeekMax: $.max('$steps.step')
        })
        .end()
      if (weekPersonResult.list.length > 0) {
        weekStartTime = weekPersonResult.list[0].weekStartTime
        res.weekSteps = weekPersonResult.list[0].weekSteps
        res.personWeekSum = weekPersonResult.list[0].personWeekSum
        res.personWeekAvg = Math.ceil(weekPersonResult.list[0].personWeekAvg)
        res.personWeekMax = weekPersonResult.list[0].personWeekMax
      }
      const monthPersonResult = await db.collection('steps')
        .aggregate()
        .match({
          _openId: event.openId,
          companyId: event.companyId,
          departId: event.departId,
        })
        .unwind({
          path: '$steps',
          includeArrayIndex: 'index',
          preserveNullAndEmptyArrays: true
        })
        .sort({
          'steps.timestamp': -1
        })
        .limit(limitMonth)
        .group({
          _id: null,
          monthDateTimes: $.push($.substr(['$steps.timestamp', 5, 5])),
          monthSteps: $.push('$steps.step'),
          monthStartTime: $.last('$steps.timestamp'),
          personMonthSum: $.sum('$steps.step'),
          personMonthAvg: $.avg('$steps.step'),
          personMonthMax: $.max('$steps.step')
        })
        .end()
      if (monthPersonResult.list.length > 0) {
        monthStartTime = monthPersonResult.list[0].monthStartTime
        res.personMonthSum = monthPersonResult.list[0].personMonthSum
        res.personMonthAvg = Math.ceil(monthPersonResult.list[0].personMonthAvg)
        res.monthSteps = monthPersonResult.list[0].monthSteps
        res.monthDateTimes = monthPersonResult.list[0].monthDateTimes
        res.personMonthMax = monthPersonResult.list[0].personMonthMax
      }
    }
    //部门
    {
      const todayDepartResult = await db.collection('steps')
        .aggregate()
        .match({
          companyId: event.companyId,
          departId: event.departId,
        })
        .unwind({
          path: '$steps',
          includeArrayIndex: 'index',
          preserveNullAndEmptyArrays: true
        })
        .sort({
          'steps.timestamp': -1
        })
        .match({
          'steps.timestamp': $.gte(todayStartTime)
        })
        .group({
          _id:'$_openId',
          nickName: $.first('$nickName'),
          step: $.first('$steps.step'),
          timestamp: $.first('$steps.timestamp')
        })
        .sort({
          'step': -1
        })
        .group({
          _id:null,
          departSortTodayOpenIds: $.push('$_id'),
          // departSortTodayModels: $.push({
          //   name: '$nickName',
          //   step: '$step'
          // }),
          departSortTodayNickNames: $.push('$nickName'),
          departSortTodaySteps: $.push('$step'),
          departTodayStepSum:$.sum('$step'),
          departTodayStepAvg:$.avg('$step')
        })
        .project({
          departSortTodayOpenIds:1,
          departSortTodaySteps:1,
          departSortTodayNickNames: 1,
          departTodayStepRank: $.indexOfArray(['$departSortTodayOpenIds', event.openId]),
          departTodayStepSum:1,
          departTodayStepAvg:1
        })
        .end()
      if (todayDepartResult.list.length > 0) {
        res.departSortTodayOpenIds = todayDepartResult.list[0].departSortTodayOpenIds
        res.departSortTodayNickNames = todayDepartResult.list[0].departSortTodayNickNames
        res.departSortTodaySteps = todayDepartResult.list[0].departSortTodaySteps
        res.departTodayStepSum = todayDepartResult.list[0].departTodayStepSum
        res.departTodayStepAvg = Math.ceil(todayDepartResult.list[0].departTodayStepSum / myDepartMemberCount)
        res.departTodayStepRank = todayDepartResult.list[0].departTodayStepRank + 1
      }
      const weekDepartResult = await db.collection('steps')
        .aggregate()
        .match({
          companyId: event.companyId,
          departId: event.departId,
        })
        .unwind({
          path: '$steps',
          includeArrayIndex: 'index',
          preserveNullAndEmptyArrays: true
        })
        .sort({
          'steps.timestamp': -1
        })
        .match({
          'steps.timestamp': $.gte(weekStartTime)
        })
        .group({
          _id: '$_openId',
          nickName: $.first('$nickName'),
          step: $.sum('$steps.step'),
        })
        .sort({
          'step': -1
        })
        .group({
          _id: null,
          departSortWeekOpenIds: $.push('$_id'),
          departSortWeekNickNames: $.push('$nickName'),
          departSortWeekSteps: $.push('$step'),
          departWeekStepSum: $.sum('$step'),
          departWeekStepAvg: $.avg('$step')
        })
        .project({
          departWeekStepRank: $.indexOfArray(['$departSortWeekOpenIds', event.openId]),
          departWeekStepSum: 1,
          departWeekStepAvg: 1,
          departSortWeekOpenIds: 1,
          departSortWeekSteps: 1,
          departSortWeekNickNames: 1,
        })
        .end()
      if (weekDepartResult.list.length > 0) {
        res.departSortWeekOpenIds = weekDepartResult.list[0].departSortWeekOpenIds
        res.departSortWeekSteps = weekDepartResult.list[0].departSortWeekSteps
        res.departSortWeekNickNames = weekDepartResult.list[0].departSortWeekNickNames
        res.departWeekStepSum = weekDepartResult.list[0].departWeekStepSum
        res.departWeekStepAvg = Math.ceil(weekDepartResult.list[0].departWeekStepSum / myDepartMemberCount)
        res.departWeekStepRank = weekDepartResult.list[0].departWeekStepRank + 1
      }

      const monthDepartResult = await db.collection('steps')
        .aggregate()
        .match({
          companyId: event.companyId,
          departId: event.departId,
        })
        .unwind({
          path: '$steps',
          includeArrayIndex: 'index',
          preserveNullAndEmptyArrays: true
        })
        .sort({
          'steps.timestamp': -1
        })
        .match({
          'steps.timestamp': $.gte(monthStartTime)
        })
        .group({
          _id: '$_openId',
          nickName: $.first('$nickName'),
          step: $.sum('$steps.step'),
        })
        .sort({
          'step': -1
        })
        .group({
          _id: null,
          departSortMonthOpenIds: $.push('$_id'),
          departSortMonthNickNames: $.push('$nickName'),
          departSortMonthSteps: $.push('$step'),
          departMonthStepSum: $.sum('$step'),
          departMonthStepAvg: $.avg('$step')
        })
        .project({
          departMonthStepRank: $.indexOfArray(['$departSortMonthOpenIds', event.openId]),
          departMonthStepSum: 1,
          departMonthStepAvg: 1,
          departSortMonthOpenIds: 1,
          departSortMonthNickNames: 1,
          departSortMonthSteps: 1,
        })
        .end()
      if (monthDepartResult.list.length > 0) {
        res.departSortMonthOpenIds = monthDepartResult.list[0].departSortMonthOpenIds
        res.departSortMonthNickNames = monthDepartResult.list[0].departSortMonthNickNames
        res.departSortMonthSteps = monthDepartResult.list[0].departSortMonthSteps
        res.departMonthStepSum = monthDepartResult.list[0].departMonthStepSum
        res.departMonthStepAvg = Math.ceil(monthDepartResult.list[0].departMonthStepSum / myDepartMemberCount)
        res.departMonthStepRank = monthDepartResult.list[0].departMonthStepRank + 1
      }
    }
    //公司
    {
      const todayCompanyResult = await db.collection('steps')
        .aggregate()
        .match({
          companyId: event.companyId
        })
        .unwind({
          path: '$steps',
          includeArrayIndex: 'index',
          preserveNullAndEmptyArrays: true
        })
        .sort({
          'steps.timestamp': -1
        })
        .match({
          'steps.timestamp': $.gte(todayStartTime)
        })
        .group({
          _id: '$_openId',
          nickName: $.first('$nickName'),
          step: $.first('$steps.step')
        })
        .sort({
          'step': -1//这样排序，openID 的addToSet 操作正好是倒序，可以用于计算排序
        })
        .group({
          _id: null,
          companySortTodayOpenIds: $.push('$_id'),
          companySortTodayNickNames: $.push('$nickName'),
          companySortTodaySteps: $.push('$step'),
          companyTodaySteps: $.push('$step'),
          companyTodayStepSum: $.sum('$step'),
          companyTodayStepAvg: $.avg('$step')
        })
        .project({
          companyTodayStepPersonSumRank: $.indexOfArray(['$companySortTodayOpenIds', event.openId]),
          companyTodayStepSum: 1,
          companyTodayStepAvg: 1,
          companySortTodayOpenIds: 1,
          companySortTodayNickNames: 1,
          companySortTodaySteps: 1
        })
        .end()
      if (todayCompanyResult.list.length > 0) {
        res.companySortTodayOpenIds = todayCompanyResult.list[0].companySortTodayOpenIds
        res.companySortTodayNickNames = todayCompanyResult.list[0].companySortTodayNickNames
        res.companySortTodaySteps = todayCompanyResult.list[0].companySortTodaySteps
        res.companyTodayStepSum = todayCompanyResult.list[0].companyTodayStepSum
        res.companyTodayStepAvg = Math.ceil(todayCompanyResult.list[0].companyTodayStepSum / companyPersonCount)
        res.companyTodayStepPersonSumRank = todayCompanyResult.list[0].companyTodayStepPersonSumRank + 1
      }

      const todayCompanyResultDepartAvg = await db.collection('steps')
        .aggregate()
        .match({
          companyId: event.companyId
        })
        .unwind({
          path: '$steps',
          includeArrayIndex: 'index',
          preserveNullAndEmptyArrays: true
        })
        .match({
          'steps.timestamp': $.gte(todayStartTime)
        })
        .group({
          _id: '$departId',
          sumStep: $.sum('$steps.step'),
        })
        .group({
          _id:null,
          companyDepartSortTodayModels: $.push({
            id: '$_id',
            sumStep: '$sumStep',
          })
        })
        .end()
      if (todayCompanyResultDepartAvg.list.length > 0) {
        res.companyDepartSortTodayModels = todayCompanyResultDepartAvg.list[0].companyDepartSortTodayModels
      }
      //公司本周
      const weekCompanyResult = await db.collection('steps')
        .aggregate()
        .match({
          companyId: event.companyId
        })
        .unwind({
          path: '$steps',
          includeArrayIndex: 'index',
          preserveNullAndEmptyArrays: true
        })
        .sort({
          'steps.timestamp': -1
        })
        .match({
          'steps.timestamp': $.gte(weekStartTime)
        })
        .group({
          _id: '$_openId',
          nickName: $.first('$nickName'),
          step: $.sum('$steps.step')
        })
        .sort({
          'step': -1//这样排序，openID 的addToSet 操作正好是倒序，可以用于计算排序
        })
        .group({
          _id: null,
          companySortWeekOpenIds: $.push('$_id'),
          companySortWeekNickNames: $.push('$nickName'),
          companySortWeekSteps: $.push('$step'),
          companyWeekStepSum: $.sum('$step'),
          companyWeekStepAvg: $.avg('$step')
        })
        .project({
          companyWeekStepPersonSumRank: $.indexOfArray(['$companySortWeekOpenIds', event.openId]),
          companyWeekStepSum: 1,
          companyWeekStepAvg: 1,
          companySortWeekOpenIds: 1,
          companySortWeekNickNames: 1,
          companySortWeekSteps: 1
        })
        .end()
      if (weekCompanyResult.list.length > 0) {
        res.companySortWeekOpenIds = weekCompanyResult.list[0].companySortWeekOpenIds
        res.companySortWeekNickNames = weekCompanyResult.list[0].companySortWeekNickNames
        res.companySortWeekSteps = weekCompanyResult.list[0].companySortWeekSteps
        res.companyWeekStepSum = weekCompanyResult.list[0].companyWeekStepSum
        res.companyWeekStepAvg = Math.ceil(weekCompanyResult.list[0].companyWeekStepSum / companyPersonCount)
        res.companyWeekStepPersonSumRank = weekCompanyResult.list[0].companyWeekStepPersonSumRank + 1
      }

      const weekCompanyResultDepartAvg = await db.collection('steps')
        .aggregate()
        .match({
          companyId: event.companyId
        })
        .unwind({
          path: '$steps',
          includeArrayIndex: 'index',
          preserveNullAndEmptyArrays: true
        })
        .match({
          'steps.timestamp': $.gte(weekStartTime)
        })
        .group({
          _id: '$departId',
          sumStep: $.sum('$steps.step')
        })
        .group({
          _id: null,
          companyDepartSortWeekModels: $.push({
            id: '$_id',
            sumStep: '$sumStep',
          })
        })
        .end()
      if (weekCompanyResultDepartAvg.list.length > 0) {
        res.companyDepartSortWeekModels = weekCompanyResultDepartAvg.list[0].companyDepartSortWeekModels
      }

      //公司本月
      const monthCompanyResult = await db.collection('steps')
        .aggregate()
        .match({
          companyId: event.companyId
        })
        .unwind({
          path: '$steps',
          includeArrayIndex: 'index',
          preserveNullAndEmptyArrays: true
        })
        .sort({
          'steps.timestamp': -1
        })
        .match({
          'steps.timestamp': $.gte(monthStartTime)
        })
        .group({
          _id: '$_openId',
          nickName: $.first('$nickName'),
          step: $.sum('$steps.step')
        })
        .sort({
          'step': -1//这样排序，openID 的addToSet 操作正好是倒序，可以用于计算排序
        })
        .group({
          _id: null,
          companySortMonthOpenIds: $.push('$_id'),
          companySortMonthNickNames: $.push('$nickName'),
          companySortMonthSteps: $.push('$step'),
          companyMonthStepSum: $.sum('$step'),
          companyMonthStepAvg: $.avg('$step')
        })
        .project({
          companyMonthStepPersonSumRank: $.indexOfArray(['$companySortMonthOpenIds', event.openId]),
          companyMonthStepSum: 1,
          companyMonthStepAvg: 1,
          companySortMonthOpenIds: 1,
          companySortMonthNickNames: 1,
          companySortMonthSteps: 1
        })
        .end()
      if (monthCompanyResult.list.length > 0) {
        res.companySortMonthOpenIds = monthCompanyResult.list[0].companySortMonthOpenIds
        res.companySortMonthNickNames = monthCompanyResult.list[0].companySortMonthNickNames
        res.companySortMonthSteps = monthCompanyResult.list[0].companySortMonthSteps
        res.companyMonthStepSum = monthCompanyResult.list[0].companyMonthStepSum
        res.companyMonthStepAvg = Math.ceil(monthCompanyResult.list[0].companyMonthStepSum / companyPersonCount)
        res.companyMonthStepPersonSumRank = monthCompanyResult.list[0].companyMonthStepPersonSumRank + 1
      }

      const monthCompanyResultDepartAvg = await db.collection('steps')
        .aggregate()
        .match({
          companyId: event.companyId
        })
        .unwind({
          path: '$steps',
          includeArrayIndex: 'index',
          preserveNullAndEmptyArrays: true
        })
        .match({
          'steps.timestamp': $.gte(monthStartTime)
        })
        .group({
          _id: '$departId',
          sumStep: $.sum('$steps.step'),
        })
        .group({
          _id: null,
          companyDepartSortMonthModels: $.push({
            id: '$_id',
            sumStep: '$sumStep',
          })
        })
        .end()
      if (monthCompanyResultDepartAvg.list.length > 0) {
        res.companyDepartSortMonthModels = monthCompanyResultDepartAvg.list[0].companyDepartSortMonthModels
      }
    }

    return {
      data: res
    }
   } catch (e) {
    console.error(e)
  }
}