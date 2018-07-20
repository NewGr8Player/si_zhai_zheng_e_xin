//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    selected: false,
    loading: true,
    fadeout: false,
    firstPage: true,
    tips:true,
    messageSelect:"",
    messageDom:"",
    step: 0,
    score: 0,
    scoreData: [{
        "id": 0,
        "score": -20,
        "tips": "请问你是怎么找到女朋友的？租来的吧",
        "left": "分手！再也不见！！"
      },
      {
        "id": 1,
        "score": -10,
        "tips": "恭喜你捡回一条命！下次可没这么好运了。",
        "left": "呵呵"
      },
      {
        "id": 2,
        "score": -5,
        "tips": "赶快哄哄吧，不然你就凉了。",
        "left": "伐开心……"
      },
      {
        "id": 3,
        "score": 5,
        "tips": "不得不说，你的求生意识真的很强。",
        "left": "勉强算你过关了吧"
      },
      {
        "id": 4,
        "score": 15,
        "tips": "深得女神心！",
        "left": "亲爱的你真好~"
      },
    ],
    messageData: [{
        "id": 0,
        "left": "亲爱的，我今天穿的这件衣服好看吗？",
        "right": {
          "0": {
            "text": "还行",
            "reply": "哼，敷衍",
            "score": -3
          },
          "1": {
            "text": "好丑- -",
            "reply": "你丫是不是不想活了(•́へ•́╬)",
            "score": -5
          },
          "2": {
            "text": "还用问？我老婆穿什么都好看！",
            "reply": "我花了一个小时才挑出这件的呢（づ￣3￣）づ╭❤～",
            "score": 5
          }
        }
      },
      {
        "id": 1,
        "left": "亲爱的，那你爱我吗？",
        "right": {
          "0": {
            "text": "爱",
            "reply": "算你识相",
            "score": 0
          },
          "1": {
            "text": "这还用问吗？",
            "reply": "你不爱我了",
            "score": -3
          },
          "2": {
            "text": "你烦不烦啊？",
            "reply": "……",
            "score": -5
          }
        }
      },
      {
        "id": 2,
        "left": "你觉得我胖了吗？",
        "right": {
          "0": {
            "text": "我就是喜欢你这样肉肉的，超可爱",
            "reply": "嘿嘿(*/ω＼*)",
            "score": 5
          },
          "1": {
            "text": "确实是胖了",
            "reply": "一会儿去跪键盘，自觉点(▼へ▼メ)",
            "score": -5
          },
          "2": {
            "text": "没胖",
            "reply": "口是心非，我看你还是觉得我胖",
            "score": -3
          }
        }
      },
      {
        "id": 3,
        "left": "你觉得我闺蜜怎么样？",
        "right": {
          "0": {
            "text": "挺漂亮的",
            "reply": "再见来不及挥手(　 ´-ω -)▄︻┻┳══━一",
            "score": -5
          },
          "1": {
            "text": "我都没怎么注意她",
            "reply": "你是不是喜欢她！！！",
            "score": -3
          },
          "2": {
            "text": "她人挺不错的，你要好好珍惜这样的朋友",
            "reply": "恩恩，我们俩从小就很好",
            "score": 5
          } 
        }
      }
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    this.hideLoading();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /*
   * 滚动底部
   */
  scrollToBottom: function() {
    wx.createSelectorQuery().select('main').boundingClientRect(function(rect) {
      /* 使页面滚动到底部 */
      wx.pageScrollTo({
        scrollTop: rect
      })
    }).exec();
  },
  hasClass: function(element, className) {
    return element.classList.contains(className);
  },
  hideLoading: function() {
    setTimeout(() => {
      this.setData({
        loading: false
      });
    }, 2000);
  },
  firstPageContinue: function () {
    this.setData({
      fadeout: true
    });
    setTimeout(() => {
      this.setData({
        firstPage: false
      });
      this.oneStep(0);
    }, 300)},
  iconReplay:function(){
//刷新
  },
  angry:function(){
    wx.showToast({
      title: "女朋友的微信也敢不回？",
      duration: 2000
    })
  },
  noGiveUp:function(){
    wx.showToast({
      title: "别挣扎了，只有下面三个选项",
      duration: 2000
    })
  },
  choose: function (event){
    let target = event.target
    let currentTarget = event.currentTarget
    while (target !== currentTarget) {
      if (hasClass(target, 'message-selected')) {
        const message = target.querySelector('.message').innerText
        this.appendMessage('right', message);
        getReply(message)
        getScore(message);
        nextStep();
        return
      }
      target = target.parentNode
    }
  },
  /*
   * @param{String} side 左右
   * @param{String} message 主页面消息
   */
  getMessage: function(side, message) {
    const template = `
  <div class="message-item message-item-${side}">
    <img class="avatar" src="./images/${side == 'left' ? 'girl' : 'boy'}.png" alt="头像">
    <div class="message">${message}</div>
  </div>
  `
    return template;
  },
  /*
   * @param{String} message 选择框消息
   */
  getSelectMessage: function(message) {
    return `
    <div class="message-item message-item-right message-selected">
      <img class="avatar" src="./images/boy.png" alt="头像">
      <div class="message">` + message + `</div>
    </div>
  `
  },
  /*
   * 遍历显示选择框消息
   */
  changeSelectMessage: function() {
    const currentMsg = this.data.messageData[this.data.step];
    let selectMsgStr = '';
    for (var i in currentMsg.right) {
      let message = currentMsg.right[i].text;
      selectMsgStr += this.getSelectMessage(message);
    }
    this.setData({
      messageSelect: selectMsgStr
    })
  },
  /*
   * 计算得分
   * @parma{String} message 点击的文字匹配得分
   */
  getScore: function(message) {
    const currentMsg = this.data.messageData[this.data.step];
    for (i in currentMsg.right) {
      if (message == currentMsg.right[i].text) {
        score += currentMsg.right[i].score;
      }
    }
  },
  /*
   * 回复
   * @parma{String} message 点击的文字匹配回复
   */
  getReply: function(message) {
    let reply
    let currentMsg = this.data.messageData[this.data.step];
    for (i in currentMsg.right) {
      if (message == currentMsg.right[i].text) {
        reply = currentMsg.right[i].reply;
      }
    }
    setTimeout(() => {
      this.appendMessage('left', reply)
    }, 500)
  },
  /*
   * @param{String} side 左右
   * @param{String} message 主页面消息
   */
  appendMessage: function(side, message) {
    this.setData({
      messageDom : this.getMessage(side, message)
    })
  },
  /*
   * 下一步
   */
  nextStep: function() {
    this.data.step++;
    this.setData({
      selected:false
    });
    if (this.data.step >= this.data.messageData.length) {
      showResult()
    } else {
      setTimeout(() => {
        this.oneStep(this.data.step);
      }, 950)
    }
  },
  /*
   * @parma{Object} resultObj 得分数组
   */
  showTips: function(resultObj) {
    this.setData({
      tips:false
    })
  },
  /*
   * 通过分数查找结果
   * @param{Number} score
   */
  getResultByScore: function(score) {
    let result
    for (i in scoreData) { 
      if (score >= scoreData[i].score) {
        result = scoreData[i]
      }
    }
    return result
  },
  /*
   * 显示最后结果
   */
  showResult: function() {
    const result = getResultByScore(score)
    // 最后一句话
    setTimeout(() => {
      const result = getResultByScore(score)
      this.appendMessage('left', result.left)
      this.scrollToBottom()
      setTimeout(() => {
        showTips(result)
      }, 1000)
    }, 1000)
  },
  /*
   * @param{Number} step 步数
   */
  oneStep: function(step) {
    const currentMsg = this.data.messageData[step];
    this.appendMessage('left', currentMsg.left)
    setTimeout(() => {
      this.changeSelectMessage();
      this.setData({
        selected: true
      });
      this.scrollToBottom()
    }, 500)
  }
})