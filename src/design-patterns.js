// SOLID 原则 (单一职责 / 开放封闭 / 里氏替换 / 接口隔离 / 依赖反转)

// 简单工厂模式
function User(name , age, career, work) {
  this.name = name
  this.age = age
  this.career = career 
  this.work = work
}

function Factory(name, age, career) {
  let work

  switch (career) {
      case 'coder':
          work =  ['写代码','写系分', '修Bug'] 
          break
      case 'product manager':
          work = ['订会议室', '写PRD', '催更']
          break
      case 'boss':
          work = ['喝茶', '看报', '见客户']
      case 'xxx':
          // 其它工种的职责分配...
  }

  return new User(name, age, career, work)
}

// 抽象工厂模式
class MobilePhoneFactory {
  // 提供操作系统的接口
  createOS() {
      throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！")
  }
  // 提供硬件的接口
  createHardWare() {
      throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！")
  }
}

// 具体工厂继承自抽象工厂
class FakeStarFactory extends MobilePhoneFactory {
  createOS() {
      // 提供安卓系统实例
      return new AndroidOS()
  }
  createHardWare() {
      // 提供高通硬件实例
      return new QualcommHardWare()
  }
}

// 定义操作系统这类产品的抽象产品类
class OS {
  controlHardWare() {
      throw new Error('抽象产品方法不允许直接调用，你需要将我重写！')
  }
}

// 定义具体操作系统的具体产品类
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

// 定义手机硬件这类产品的抽象产品类
class HardWare {
  // 手机硬件的共性方法，这里提取了“根据命令运转”这个共性
  operateByOrder() {
      throw new Error('抽象产品方法不允许直接调用，你需要将我重写！')
  }
}

// 定义具体硬件的具体产品类
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

// 这是我的手机
const myPhone = new FakeStarFactory()
// 让它拥有操作系统
const myOS = myPhone.createOS()
// 让它拥有硬件
const myHardWare = myPhone.createHardWare()
// 启动操作系统(输出‘我会用安卓的方式去操作硬件’)
myOS.controlHardWare()
// 唤醒硬件(输出‘我会用高通的方式去运转’)
myHardWare.operateByOrder()

// 单例模式
class Singleton {
  show() {
      console.log('我是一个单例对象')
  }
  static getInstance() {
      // 判断是否已经new过1个实例
      if (!Singleton.instance) {
          // 若这个唯一的实例不存在，那么先创建它
          Singleton.instance = new Singleton()
      }
      // 如果这个唯一的实例已经存在，则直接返回
      return Singleton.instance
  }
}

function Singleton(name) {
  this.name = name
}

Singleton.getInstance = (function() {
  let instance = null
  return function(name) {
    if (!instance) {
      instance = new Singleton(name)
    }
    return instance
  }
})()

// 装饰器模式 

// 定义打开按钮
class OpenButton {
  // 点击后展示弹框（旧逻辑）
  onClick() {
    const modal = new Modal()
    modal.style.display = 'block'
  }
}

// 定义按钮对应的装饰器
class Decorator {
  // 将按钮实例传入
  constructor(open_button) {
      this.open_button = open_button
  }
  
  onClick() {
      this.open_button.onClick()
      // “包装”了一层新逻辑
      this.changeButtonStatus()
  }
  
  changeButtonStatus() {
      this.changeButtonText()
      this.disableButton()
  }
  
  disableButton() {
      const btn =  document.getElementById('open')
      btn.setAttribute("disabled", true)
  }
  
  changeButtonText() {
      const btn = document.getElementById('open')
      btn.innerText = '快去登录'
  }
}

const openButton = new OpenButton()
const decorator = new Decorator(openButton)

document.getElementById('open').addEventListener('click', function() {
  // openButton.onClick()
  // 此处可以分别尝试两个实例的onClick方法，验证装饰器是否生效
  decorator.onClick()
})

