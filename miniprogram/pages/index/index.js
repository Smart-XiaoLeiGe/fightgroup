//index.js

import * as echarts from '../../ec-canvas/echarts';
const { $Message } = require('../../dist/base/index');


var chartWeekList
var chartMonthList
var monthDateTimes
var personWeekMax
var personMonthMax
var weekChartInstance
var weekChartOption

function initWeekChart(canvas, width, height) {
  // if(width == 0 || height == 0){
  //   width = 255;
  //   height = 127;
  // }
  weekChartInstance = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(weekChartInstance);
  weekChartOption = {
    grid: {
      show: false,
      top: '8%',
      bottom: '2%',
      left: '3%',
      right: '7%',
      containLabel: true,
      // backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    tooltip: {
      position: ['20%', '20%']
    },
    xAxis: {
      type: 'category',
      // boundaryGap: false,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // show: false
    },
    yAxis: {
      axisLine: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: '#999'
        }
      }
      // show: false
    },
    series: [
      // { // For shadow
      //   type: 'bar',
      //   itemStyle: {
      //     normal: { color: 'rgba(0,0,0,0.05)' }
      //   },
      //   barGap: '-100%',
      //   barCategoryGap: '40%',
      //   data: dataShadow,
      //   animation: false
      // },
      {
        type: 'bar',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1, [{
                  offset: 0,
                  color: '#83bff6'
                },
                {
                  offset: 0.5,
                  color: '#188df0'
                },
                {
                  offset: 1,
                  color: '#188df0'
                }
              ]
            )
          },
          emphasis: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1, [{
                  offset: 0,
                  color: '#2378f7'
                },
                {
                  offset: 0.7,
                  color: '#2378f7'
                },
                {
                  offset: 1,
                  color: '#83bff6'
                }
              ]
            )
          }
        },
        data: chartWeekList
      }
    ]
  };
  weekChartInstance.setOption(weekChartOption);
  return weekChartInstance;
}

function initMonthChart(canvas, width, height) {
  // if (width == 0 || height == 0) {
  //   width = 255;
  //   height = 127;
  // }
  var chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  var option = {
    grid: {
      show: false,
      top: '8%',
      bottom: '2%',
      left: '3%',
      right: '7%',
      containLabel: true,
      // backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    tooltip: {
      position: ['20%', '20%']
    },
    xAxis: {
      data: monthDateTimes,

      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      axisLine: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: ['#aaa']
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: '#999'
        }
      }
    },
    series: [
      //   { // For shadow
      //   type: 'bar',
      //   itemStyle: {
      //     normal: { color: 'rgba(0,0,0,0.05)' }
      //   },
      //   barGap: '-100%',
      //   barCategoryGap: '40%',
      //     data: dataShadow,
      //   animation: false
      // },
      {
        type: 'bar',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1, [{
                  offset: 0,
                  color: '#83bff6'
                },
                {
                  offset: 0.5,
                  color: '#188df0'
                },
                {
                  offset: 1,
                  color: '#188df0'
                }
              ]
            )
          },
          emphasis: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1, [{
                  offset: 0,
                  color: '#2378f7'
                },
                {
                  offset: 0.7,
                  color: '#2378f7'
                },
                {
                  offset: 1,
                  color: '#83bff6'
                }
              ]
            )
          }
        },
        data: chartMonthList
      }
    ]
  };
  chart.setOption(option);
  console.log("month chart init"+width+" "+height+" "+JSON.stringify(option))
  return chart;
}

const app = getApp()

var that
var list = []

Page({
  data: {
    stPersonTitle:'Me',
    stDepartTitle: 'Depart',
    stCompanyTitle: 'Company',
    tpTodayTitle: 'Today',
    tpWeekTitle: 'Week',
    tpMonthTitle: 'Month',
    sortPersonTitle: 'Me Sort',
    sortDepartTitle: 'Depart Sort',
    avatarUrl: '',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    myStep: undefined,
    current: 'tabPerson',
    showSelectOrg: false,
    selectOrgTitle: 'Select company and depart：',
    buttonTipTitle: '',
    multiIndex: [0, 0],
    multiArray: [
      [''],
      ['']
    ],
    // companyName: "",
    // departName: "",
    showInfo: {},
    showData: false,
    disableButton: false,
    orgInfo: {},
    orgComparsionData: {},
    showWeekChart: false,
    showMonthChart: false,
    spinShow: false,
    nickName: "Please click avatar",
    seg_current: 0,
    seg_company_current: 0,
    seg_current_depart: 0,
    sortList: [],
    departSortList:[],
    scrollViewHeight:'',
    aviableWinHeight: '',
    bgImageUrl:''
  },

  onShareAppMessage: function(res) {
    return {
      title: '快来使用TeamWalk吧！',
      path: '/pages/index/index',
      success: function() {},
      fail: function() {}
    }
  },

  onReady:function() {
    
  },

  onShow: function() {
    that = this;
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    var aviableWinHeight = wx.getSystemInfoSync().windowHeight + 'px'
    that.setData({
      aviableWinHeight: aviableWinHeight
    })

    // that.data.sortList = [
    //   { index: 1, nickName: "王磊1", todayStep: "1289", weekStep: "12345", monthStep: "123456", isMe: false},
    // { index: 1, nickName: "王磊", todayStep: "1289", weekStep: "12345", monthStep: "123456", isMe:true}
    // ]
    // that.setData({
    //   sortList: that.data.sortList
    // })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                current: "tabPerson",
                disableButton: true,
                buttonTipTitle: "",
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                nickName: res.userInfo.nickName
              })
            }
          })
          that.mGetOpenId()
        } else {
          this.setData({
            disableButton: false
          })
        }
      }
    })
  },

  onLoad: function() {
    wx.cloud.getTempFileURL({
      fileList: ['cloud://dev-b6b53.6465-dev-b6b53-1300038898/images/runningBg','cloud://dev-b6b53.6465-dev-b6b53-1300038898/images/user-unlogin.png'],
      success: res => {
        // get temp file URL
        console.log(res.fileList)
        if(res.fileList.length>0){
          that.setData({
            bgImageUrl: res.fileList[0].tempFileURL
          })
          if(that.data.avatarUrl.length<=0){
            that.setData({
              avatarUrl: res.fileList[1].tempFileURL
            })
          }
        }
      },
      fail: err => {
        // handle error
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        disableButton:true,
        buttonTipTitle: "",
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        nickName: e.detail.userInfo.nickName
      })
      that.mGetOpenId()
    }
  },

  onGetOpenid: function() {
    that.mGetOpenId()
  },

  mGetOpenId: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid //oeDEa0b9m2M-KFNmMDhRPsRkf6q0
        that.mGetSteps()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  mGetOrg: function() {
    // const db = wx.cloud.database()
    // // 查询当前用户所有的 counters
    // db.collection('companys').get({
    //   success: res => {
    //     console.log(res);

    //     console.log('[数据库] [查询记录] 成功: ', res)
    //   },
    //   fail: err => {
    //     console.error('[数据库] [查询记录] 失败：', err)
    //   }
    // })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getGroup',
      // 传递给云函数的event参数
      data: {
        openId: app.globalData.openid
      }
    }).then(res => {
      that.mGetAllGroups()
      if (res.result.data.companyName.length > 0 && res.result.data.departName.length > 0) {
        that.setData({
          "showData": true,
          "selectOrgTitle": "",
          orgInfo: res.result.data
        })
        console.log("getGroup :" + JSON.stringify(res))
        app.globalData.orgInfo = res.result.data
        //更新今天的数据
        that.mUpdateUserData()
        // that.mGetComparisonData()
      } else {
        that.mUpdateEmployee()
      }
    }).catch(err => {
      // handle error
      console.log(err)
    })
  },

  mGetAllGroups: function() {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getAllGroup',
    }).then(res => {
      console.log("mGetAllGroups :" + JSON.stringify(res))
      //app.globalData.allOrgs = res.result.data
      //let new_Company = arr.map(obj => { return obj.name })
      var newMultiArray = [res.result.data.companys, res.result.data.departs]
      that.setData({
        multiArray: newMultiArray
      })
      console.log("multiArray" + JSON.stringify(that.data.multiArray))
    }).catch(err => {
      // handle error
      console.log(err)
    })
  },

  mUpdateUserData: function() {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'updateData',
      // 传递给云函数的event参数
      data: {
        openId: app.globalData.openid,
        companyId: that.data.orgInfo.companyId,
        departId: that.data.orgInfo.departId,
        nickName: that.data.nickName,
        userData: app.globalData.runData.stepInfoList
      }
    }).then(res => {
      console.log("mUpdateUserData :" + JSON.stringify(res))
      if (('stats' in res.result && res.result.stats.updated > 0) ||
        ('_id' in res)
      ) {
        that.setData({
          spinShow: true,
        })
        that.mGetComparisonData(()=>{})
      }
    }).catch(err => {
      // handle error
      console.log(err)
      that.setData({
        spinShow: false,
      })
      $Message({
        content: '更新数据失败！',
        type: 'error',
        duration: 3
      });
    })
  },

  mGetSteps: function() {
    wx.getWeRunData({
      success(res) {
        // 拿 encryptedData 到开发者后台解密开放数据
        const encryptedData = res.encryptedData
        // 或拿 cloudID 通过云调用直接获取开放数据
        const cloudID = res.cloudID
        console.log('res :' + JSON.stringify(res))

        wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'getStepData',
          // 传递给云函数的event参数
          data: {
            weRunData: wx.cloud.CloudID(cloudID), // 这个 CloudID 值到云函数端会被替换
            obj: {
              shareInfo: wx.cloud.CloudID(cloudID), // 非顶层字段的 CloudID 不会被替换，会原样字符串展示
            }
          }
        }).then(res => {
          var runData = res.result.event.weRunData.data;
          let new_Company = runData.stepInfoList.map(obj => {
            var unixTimestamp = new Date((obj.timestamp + 8 * 3600) * 1000);
            var commonTime = unixTimestamp.toLocaleString('en-US', {
              timeZone: 'Asia/Shanghai',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });
            var commonTime1 = unixTimestamp.toISOString();
            obj.timestamp = commonTime1;
            return obj;
          })
          app.globalData.runData = runData
          if (runData.stepInfoList) {
            console.log("runData :" + JSON.stringify(runData.stepInfoList))
            var step = runData.stepInfoList[runData.stepInfoList.length - 1].step
            that.setData({
              myStep: step,
              showSelectOrg: true,
            });
            that.mGetOrg()
          }

        }).catch(err => {
          // handle error
          console.log(err)
        })
      },
      fail(error) {
        console.log('getWeRunData' + error.errMsg)
      }
    })
  },

  mChangeOrg: function() {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'changeGroupRelation',
      // 传递给云函数的event参数
      data: {
        openId: app.globalData.openid,
        companyId: that.data.orgInfo.companyId,
        departId: that.data.orgInfo.departId,
      }
    }).then(res => {
      console.log("mChangeOrg :" + JSON.stringify(res))
      if (('stats' in res.result && res.result.stats.updated > 0) ||
        ('_id' in res)
      ) {
        that.mUpdateUserData()
      }else{
        that.setData({
          spinShow: false,
        })
      }
    }).catch(err => {
      // handle error
      console.log(err)
      that.setData({
        spinShow: false,
      })
      $Message({
        content: '更改部门失败！',
        type: 'error',
        duration: 3
      });
    })
  },

  mUpdateEmployee: function() {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'updateEmployee',
      // 传递给云函数的event参数
      data: {
        openId: app.globalData.openid,
        name: that.data.userInfo.nickName
      }
    }).then(res => {
      console.log("mUpdateEmployee :" + JSON.stringify(res))
    }).catch(err => {
      // handle error
      console.log(err)
    })
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.mGetComparisonData(()=>{
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },

  mGetComparisonData: function(callback) {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getComparisonData',
      // 传递给云函数的event参数
      data: {
        openId: app.globalData.openid,
        companyId: that.data.orgInfo.companyId,
        departId: that.data.orgInfo.departId,
      }
    }).then(res => {
      callback();
      console.log("mGetComparisonData :" + JSON.stringify(res))
      personWeekMax = res.result.data.personWeekMax
      personMonthMax = res.result.data.personMonthMax
      chartWeekList = res.result.data.weekSteps.reverse()
      chartMonthList = res.result.data.monthSteps.reverse()
      monthDateTimes = res.result.data.monthDateTimes.reverse()
      // monthDateTimes = tMonthDateTimes.map(obj=>{
      //   return obj = obj.
      // })

      // that.mPrepareSortData(res)
      if (that.data.current == 'tabPerson'){
        that.setData({
          showWeekChart:false,
          showMonthChart:false,
        })
      }

      that.setData({
        current: "tabPerson",
        weekChart: {
          onInit: initWeekChart
        },
        monthChart: {
          onInit: initMonthChart
        },
        orgComparsionData: res.result.data,
        spinShow: false,
        showWeekChart: true,
        showMonthChart: true
      })

      that.mRefreshData()
    }).catch(err => {
      // handle error
      console.log(err)
      that.setData({
        spinShow: false,
      })
      $Message({
        content: '更新数据失败！',
        type: 'error',
        duration: 3
      });
    })
  },

  mRefreshData: function() {
    switch (that.data.current) {
      case "tabPerson":
        that.setData({
          "showInfo.r0c1": that.data.orgComparsionData.personStep,
          "showInfo.r1c1": that.data.orgComparsionData.personWeekSum,
          "showInfo.r1c2": that.data.orgComparsionData.personWeekAvg,
          "showInfo.r2c1": that.data.orgComparsionData.personMonthSum,
          "showInfo.r2c2": that.data.orgComparsionData.personMonthAvg,
          // showWeekChart:true,
          // showMonthChart: true,
        })
        break;
      case "tabGroup":
        {
          that.setData({
            "showInfo.r0c1": that.data.orgComparsionData.departTodayStepSum,
            "showInfo.r0c2": that.data.orgComparsionData.departTodayStepAvg,
            "showInfo.r0c3": that.data.orgComparsionData.departTodayStepRank,
            "showInfo.r1c1": that.data.orgComparsionData.departWeekStepSum,
            "showInfo.r1c2": that.data.orgComparsionData.departWeekStepAvg,
            "showInfo.r1c3": that.data.orgComparsionData.departWeekStepRank,
            "showInfo.r2c1": that.data.orgComparsionData.departMonthStepSum,
            "showInfo.r2c2": that.data.orgComparsionData.departMonthStepAvg,
            "showInfo.r2c3": that.data.orgComparsionData.departMonthStepRank,
            // showWeekChart: false,
            // showMonthChart: false,
            // seg_current:that.data.seg_current
          })
          var query = wx.createSelectorQuery().in(this);
          query.select('#PersonSort').boundingClientRect(res => {
            var scrollViewHeight = (wx.getSystemInfoSync().windowHeight - res.top) + 'px'
            console.log("scrollViewHeight:" + scrollViewHeight)
            that.setData({
              scrollViewHeight: scrollViewHeight
            })
          }).exec();
          
          //更新今天个人排名
          that.mUpdateDepartPersonSort(that.data.seg_current)
        }
        break;
      case "tabCompany":
        {
          that.setData({
            "showInfo.r0c1": that.data.orgComparsionData.companyTodayStepSum,
            "showInfo.r0c2": that.data.orgComparsionData.companyTodayStepAvg,
            "showInfo.r1c1": that.data.orgComparsionData.companyWeekStepSum,
            "showInfo.r1c2": that.data.orgComparsionData.companyWeekStepAvg,
            "showInfo.r2c1": that.data.orgComparsionData.companyMonthStepSum,
            "showInfo.r2c2": that.data.orgComparsionData.companyMonthStepAvg,
            // showWeekChart: false,
            // showMonthChart: false,
            // seg_current: that.data.seg_current,
            // seg_current_depart: that.data.seg_current_depart,
            // seg_company_current: that.data.seg_company_current
          })
          var query = wx.createSelectorQuery().in(this);
          query.select('#DepartSort').boundingClientRect(res => {
            var scrollViewHeight = (wx.getSystemInfoSync().windowHeight - res.top) + 'px'
            console.log("scrollViewHeight:" + scrollViewHeight)
            that.setData({
              scrollViewHeight: scrollViewHeight
            })
          }).exec();
          that.mUpdateCompanyDepartSort(that.data.seg_current_depart)
          that.mUpdateDepartPersonSort(that.data.seg_company_current)
        }
        break;
      default:
        break;
    }
  },

  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
    that.mRefreshData()
  },

  bindMultiPickerChange: function(e) {

    that.setData({
      current: "tabPerson",
      "showData": true,
      spinShow: true,
      "selectOrgTitle": "",
      "orgInfo.companyName": that.data.multiArray[0][that.data.multiIndex[0]].name,
      "orgInfo.departName": that.data.multiArray[1][that.data.multiIndex[1]].name,
      "orgInfo.companyId": that.data.multiArray[0][that.data.multiIndex[0]].code,
      "orgInfo.departId": that.data.multiArray[1][that.data.multiIndex[1]].code,
    })
    that.mChangeOrg()
  },
  bindCancel: function(e) {
    that.setData({
      "multiIndex[0]": 0,
      "multiIndex[1]": 0
    })
  },
  bindMultiPickerColumnChange: function(e) {
    switch (e.detail.column) {
      case 0:
        that.setData({
          "multiIndex[0]": e.detail.value
        })
        break
      case 1:
        that.setData({
          "multiIndex[1]": e.detail.value
        })
        break
    }
  },

mUpdateTodayPersonSort: function(){
  var data = that.data.orgComparsionData
  var pDepartSortData0 = that.mPreparePersonSort(data.departSortTodayOpenIds, data.departSortTodayNickNames, data.departSortTodaySteps)
  that.setData({
    sortList: pDepartSortData0
  })
},
  mUpdateCompanyTodayPersonSort: function () {
    var data = that.data.orgComparsionData
    var pDepartSortData0 = that.mPreparePersonSort(data.companySortTodayOpenIds, data.companySortTodayNickNames, data.companySortTodaySteps)
    that.setData({
      sortList: pDepartSortData0
    })
  },
  mUpdateCompanyTodayDepartSort: function () {
    var data = that.data.orgComparsionData.companyDepartSortTodayModels
    let pDepartSortData0 = data.map((obj,index)=>{
      var orgModel = that.data.multiArray[1].find(function(item){
        return obj.id == item.code
      })
      if (orgModel != undefined){
        obj.name = orgModel.name
      }
      if (obj.id == that.data.orgInfo.departId)
        obj.isMe = true
      var departMemberCount = that.data.orgComparsionData.departInfos.find(function (item) {
        return obj.id == item._id
      })
      if (departMemberCount.openIds.length!=0){
        obj.avgStep = Math.ceil(obj.sumStep / departMemberCount.openIds.length)
      }
      return obj
    })
    pDepartSortData0.sort(function (a, b) {
      return b.avgStep - a.avgStep;
    });
    pDepartSortData0 = pDepartSortData0.map((obj, index) => {
      obj.index = index + 1;
      return obj;
    })
    that.setData({
      departSortList: pDepartSortData0
    })
  },

  mPreparePersonSort: function (ids, names, steps) {
    var models = []
    for (var i = 0; i < ids.length; i++) {
      var sortModel = {}
      sortModel.index = i + 1;
      if (i < names.length)
        sortModel.name = names[i]
      if (i < steps.length)
        sortModel.step = steps[i]
      if (ids[i] == app.globalData.openid)
        sortModel.isMe = true
      models.push(sortModel)
    }
    return models;
  },

  segmentControlOnChange: function(e) {
    if (e.detail.key === this.key) {

    }
    that.mUpdateDepartPersonSort(e.detail.key)
  },

  mUpdateDepartPersonSort:function (key){
    if (that.data.current == 'tabGroup') {
      this.setData({
        seg_current: key,
      })
    }
    if (that.data.current == 'tabCompany') {
      this.setData({
        seg_company_current: key,
      })
    }

    if (that.data.current == 'tabGroup') {
      switch (key) {
        case 0:
          that.mUpdateTodayPersonSort()
          break
        case 1:
          var data = that.data.orgComparsionData
          var pDepartSortData1 = that.mPreparePersonSort(data.departSortWeekOpenIds, data.departSortWeekNickNames, data.departSortWeekSteps)
          that.setData({
            sortList: pDepartSortData1
          })
          break
        case 2:
          var data = that.data.orgComparsionData
          var pDepartSortData2 = that.mPreparePersonSort(data.departSortMonthOpenIds, data.departSortMonthNickNames, data.departSortMonthSteps)
          that.setData({
            sortList: pDepartSortData2
          })
          break
        default:
          break
      }
    } else if (that.data.current == 'tabCompany') {
      switch (key) {
        case 0:
          that.mUpdateCompanyTodayPersonSort()
          break
        case 1:
          var data = that.data.orgComparsionData
          var pDepartSortData1 = that.mPreparePersonSort(data.companySortWeekOpenIds, data.companySortWeekNickNames, data.companySortWeekSteps)
          that.setData({
            sortList: pDepartSortData1
          })
          break
        case 2:
          var data = that.data.orgComparsionData
          var pDepartSortData2 = that.mPreparePersonSort(data.companySortMonthOpenIds, data.companySortMonthNickNames, data.companySortMonthSteps)
          that.setData({
            sortList: pDepartSortData2
          })
          break
        default:
          break
      }
    }
  },

  departSegmentControlOnChange: function(e) {
    if (e.detail.key === this.key) {

    }
    that.mUpdateCompanyDepartSort(e.detail.key)
  },

  mUpdateCompanyDepartSort:function(key){
    this.setData({
      seg_current_depart: key,
    })

    var data = undefined
    switch (key) {
      case 0:
        that.mUpdateCompanyTodayDepartSort()
        break
      case 1:
        data = that.data.orgComparsionData.companyDepartSortWeekModels
        break
      case 2:
        data = that.data.orgComparsionData.companyDepartSortMonthModels
        break
      default:
        break
    }
    if (data != undefined) {
      let pDepartSortData0 = data.map((obj, index) => {
        var orgModel = that.data.multiArray[1].find(function (item) {
          return obj.id == item.code
        })
        if (orgModel != undefined) {
          obj.name = orgModel.name
        }
        if (obj.id == that.data.orgInfo.departId)
          obj.isMe = true
        var departMemberCount = that.data.orgComparsionData.departInfos.find(function (item) {
          return obj.id == item._id
        })
        if (departMemberCount.openIds.length != 0) {
          obj.avgStep = Math.ceil(obj.sumStep / departMemberCount.openIds.length)
        }
        return obj
      })
      pDepartSortData0.sort(function (a, b) {
        return b.avgStep - a.avgStep;
      });
      pDepartSortData0 = pDepartSortData0.map((obj,index)=>{
        obj.index = index + 1;
        return obj;
      })
      that.setData({
        departSortList: pDepartSortData0
      })
    }
  }
})