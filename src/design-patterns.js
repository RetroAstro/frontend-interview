// SOLID 原则 (单一职责 / 开放封闭 / 里氏替换 / 接口隔离 / 依赖反转)

// 简单工厂模式
function User(name, age, career, work) {
  this.name = name
  this.age = age
  this.career = career 
  this.work = work
}

function Factory(name, age, career) {
  let work

  switch (career) {
      case 'coder':
          work = ['写代码', '写系分', '修Bug'] 
          break
      case 'product manager':
          work = ['订会议室', '写PRD', '催更']
          break
      case 'boss':
          work = ['喝茶', '看报', '见客户']
      default:
          throw Error('未匹配')
  }

  return new User(name, age, career, work)
}

// 抽象工厂模式
class MobilePhoneFactory {
  createOS() {
      throw new Error('抽象工厂方法不允许直接调用，你需要将我重写！')
  }
  createHardWare() {
      throw new Error('抽象工厂方法不允许直接调用，你需要将我重写！')
  }
}

class FakeStarFactory extends MobilePhoneFactory {
  createOS() {
      return new AndroidOS()
  }
  createHardWare() {
      return new QualcommHardWare()
  }
}

class OS {
  controlHardWare() {
      throw new Error('抽象产品方法不允许直接调用，你需要将我重写！')
  }
}

class AndroidOS extends OS {
  controlHardWare() {
      console.log('我会用安卓的方式去操作硬件')
  }
}

class AppleOS extends OS {
  controlHardWare() {
      console.log('我会用🍎的方式去操作硬件')
  }
}

class HardWare {
  operateByOrder() {
      throw new Error('抽象产品方法不允许直接调用，你需要将我重写！')
  }
}

class QualcommHardWare extends HardWare {
  operateByOrder() {
      console.log('我会用高通的方式去运转')
  }
}

class MiWare extends HardWare {
  operateByOrder() {
      console.log('我会用小米的方式去运转')
  }
}

const myPhone = new FakeStarFactory()
const myOS = myPhone.createOS()
const myHardWare = myPhone.createHardWare()

myOS.controlHardWare()
myHardWare.operateByOrder()

// 单例模式 (全局状态管理 Store)
class Singleton {
  show() {
      console.log('我是一个单例对象')
  }
  static getInstance() {
      if (!Singleton.instance) {
          Singleton.instance = new Singleton()
      }
      return Singleton.instance
  }
}

function Singleton(name) {
  this.name = name
}

Singleton.getInstance = (function() {
  let instance = null
  return function (name) {
    if (!instance) {
      instance = new Singleton(name)
    }
    return instance
  }
})()

// 装饰器模式 (decorator / mixin / hof / hoc / redux / koa-compose)
function funcDecorator(target, name, descriptor) {
  let method = descriptor.value

  descriptor.value = function () {
    console.log('我是 func 的装饰器逻辑')
    return method.apply(this, arguments)
  }

  return descriptor
}

class Button {
  @funcDecorator
  onClick() {
    console.log('我是 func 的原有逻辑')
  }
}

// 适配器模式 (axios)
function ajax(type, url, data, success, failed) {
  let xhr = new XMLHttpRequest()
  let method = type.toUpperCase()

  if (method == 'GET') {
    xhr.open('GET', url + '?' + data, true)
    xhr.send()
  } else if (method == 'POST') {
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(data)
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
      success(xhr.responseText)
    }
  }

  xhr.onerror = function () {
    failed(xhr.status)
  }
}

class HttpUtils {
  static get(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.json())
        .then(resolve)
        .catch(reject)
    })
  }

  static post(url, data) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
      })
        .then(res => res.json())
        .then(resolve)
        .catch(reject)
    })
  }
}

async function ajaxAdapter(type, url, data, success, failed) {
  let method = type.toUpperCase()
  let res = null

  try {
    if (method == 'GET') {
      res = await HttpUtils.get(url)
    } else if (method == 'POST') {
      res = await HttpUtils.post(url, data)
    }
    if (res && res.statusCode == 1) {
      success(res)
    } else {
      failed(res.statusCode)
    }
  } catch (err) {
    failed(err.statusCode)
  }
}

async function ajax(type, url, data, success, failed) {
  await ajaxAdapter(type, url, data, success, failed)
}

// 代理模式
class PreloadImage {
  constructor(imgNode) {
    this.imgNode = imgNode
  }

  setSrc(imgUrl) {
    this.imgNode.src = imgUrl
  }
}

class ProxyImage {
  static LOADING_URL = 'xxx.png'

  constructor(targetImage) {
    this.targetImage = targetImage
  }

  setSrc(targetUrl) {
    this.targetImage.setSrc(LOADING_URL)

    let virtualImage = new Image()

    virtualImage.src = targetUrl

    virtualImage.onload = () => {
      this.targetImage.setSrc(targetUrl)
    }
  }
}

// 策略模式
let priceProcessor = {
  pre(originPrice) {
    if (originPrice >= 100) {
      return originPrice - 20
    }
    return originPrice * 0.9
  },
  onSale(originPrice) {
    if (originPrice >= 100) {
      return originPrice - 30
    }
    return originPrice * 0.8
  },
  back(originPrice) {
    if (originPrice >= 200) {
      return originPrice - 50
    }
    return originPrice
  },
  fresh(originPrice) {
    return originPrice * 0.5
  }
}

function askPrice(tag, originPrice) {
  return priceProcessor[tag](originPrice)
}

priceProcessor.newUser = function (originPrice) {
  if (originPrice >= 100) {
    return originPrice - 50
  }
  return originPrice
}

// 状态模式 + 迭代器模式 (Promise / Generator)

// 观察者模式 (Vue 响应式原理 Dep + Watcher)
class Publisher {
  constructor() {
    this.subs = []
  }

  add(sub) {
    this.subs.push(sub)
    return this
  }

  notify() {
    this.subs.forEach(sub => sub.update(this))
  }
}

class PrdPublisher extends Publisher {
  constructor() {
    super()
    this.prdState = null
  }

  getState() {
    return this.prdState
  }

  setState(state) {
    this.prdState = state
    this.notify()
  }
}

class Subscriber {
  constructor() {
    console.log('subscriber created')
  }
  update() {
    console.log('subscriber updated')
  }
}

class DeveloperSubscriber extends Subscriber {
  constructor() {
    super()
    this.prdState = null
  }

  update(publisher) {
    this.prdState = publisher.getState()
    this.work()
  }

  work() {
    let prd = this.prdState
    console.log('work with' + prd)
  }
}

let A = new DeveloperSubscriber()
let B = new DeveloperSubscriber()
let C = new DeveloperSubscriber()

let publisher = new PrdPublisher()

publisher.add(A).add(B).add(C)

publisher.setState('some prd ...')

// 发布订阅模式 EventEmitter

/**
 *  被观察者 ---> 通知变化 ---> 观察者
 *  被观察者 <--- 订阅事件 <--- 观察者
 */

/**
 *  发布者 ---> 通知变化 ---> 事件中心 ---> 通知变化 ---> 订阅者
 *  发布者 --- 事件中心 <--- 订阅事件 <--- 订阅者
 */


