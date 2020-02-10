// 手写 call
Function.prototype.myCall1 = function (context) {
  let temp = context || window
  temp.fn = this
  let args = []
  for (let i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']')
  }
  let res = eval('temp.fn(' + args + ')')
  delete temp.fn
  return res
}

Function.prototype.myCall2 = function (context, ...args) {
  let temp = context || window
  temp.fn = this
  let res = temp.fn(...args)
  delete temp.fn
  return res
}

// 手写 apply
Function.prototype.myApply = function (context, arr = []) {
  let temp = context || window
  temp.fn = this
  let res = temp.fn(...arr)
  delete temp.fn
  return res
}

// 手写 bind
Function.prototype.myBind = function (context, ...args1) {
  let temp = this
  return function(...args2) {
    return temp.call(context, ...args1, ...args2)
  }
}

// 手写 new
function myNew(fn, ...args) {
  let obj = {}
  Object.setPrototypeOf(obj, fn.prototype)
  let res = fn.call(obj, ...args)
  return typeof res == 'object' ? res : obj
}

// 手写 instanceof
function instanceOf(left, right) {
  if (typeof left == 'object' && typeof right == 'function') {
    return right.prototype.isPrototypeOf(left)
  }
}

// 类数组转数组
let arrayLike = { 0: 'name', 1: 'age', 2: 'sex', length: 3 }

Array.prototype.slice.call(arrayLike) // ['name', 'age', 'sex'] 

Array.from(arrayLike) // ['name', 'age', 'sex'] 

// 组合继承
function Parent (name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child (name, age) {
  Parent.call(this, name)
  this.age = age
}

Child.prototype = new Parent()
Child.prototype.constructor = Child

let child1 = new Child('kevin', '18')

child1.colors.push('black')

console.log(child1.name) // kevin
console.log(child1.age) // 18
console.log(child1.colors) // ["red", "blue", "green", "black"]

let child2 = new Child('daisy', '20')

console.log(child2.name) // daisy
console.log(child2.age) // 20
console.log(child2.colors) // ["red", "blue", "green"]

// 模拟实现 Object.create
function createObj(o) {
  function F(){}
  F.prototype = o
  return new F()
}

// 寄生组合式继承
function object(o) {
  function F() {}
  F.prototype = o
  return new F()
}

function prototype(child, parent) {
  let prototype = object(parent.prototype)
  prototype.constructor = child
  child.prototype = prototype
}

// 当我们使用的时候：
prototype(Child, Parent)

// 也可以直接使用原生 JS 方法
Object.setPrototypeOf(Child.prototype, Parent.prototype)

// 函数防抖
function debounce(func, wait) {
  let timeout
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, arguments)
    }, wait)
  }
}

// 函数节流

// 1. 使用时间戳
function throttle(func, wait) {
  let prev = 0
  return function () {
    let now = +new Date()
    if (now - prev > wait) {
      func.apply(this, arguments)
      prev = now
    }
  }
}

// 2. 使用 setTimeout
function throttle(func, wait) {
  let timeout
  return function () {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(this, arguments)
      }, wait)
    }
  }
}

// 数组去重

// ES5
function unique(array) {
  let res = []
  for (let item of array) {
    if (res.indexOf(item) == -1) {
      res.push(item)
    }
  }
  return res
}

// ES6
function unique(array) {
  return [...new Set(array)]
}

function isObject(obj) {
  return typeof obj == 'object' && obj != null
}

// 浅拷贝
function shallowClone(obj) {
  if (!isObject(obj)) {
    return null
  }
  let res = obj instanceof Array ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      res[key] = obj[key]
    }
  }
  return res
}

// 深拷贝 (只拷贝对象和数组 / 破解循环引用)

// 递归版
function deepClone(obj, hash = new WeakMap()) {
  if (!isObject(obj)) {
    return null
  }
  if (hash.has(obj)) {
    return hash.get(obj)
  }
  hash.set(obj, null)
  let res = obj instanceof Array ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (isObject(obj[key])) {
        res[key] = deepClone(obj[key], hash)
      } else {
        res[key] = obj[key]
      }
    }
  }
  return res
}

// 迭代版
function deepClone(obj) {
  if (!isObject(obj)) {
    return null
  }

  let res = obj instanceof Array ? [] : {}
  let stack = [{ parent: res, key: null, data: obj }]
  let hash = new WeakMap()

  while (stack.length) {
    let { parent, key, data } = stack.pop()
    let temp = parent
    if (key != null) {
      parent[key] = data instanceof Array ? [] : {}
      temp = parent[key]
    }
    if (hash.has(data)) {
      continue
    }
    hash.set(data, null)
    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        if (isObject(data[k])) {
          stack.push({
            parent: temp,
            key: k,
            data: data[k]
          })
        } else {
          temp[k] = data[k] 
        }
      }
    }
  }

  return res
}

// 数组扁平化

// 递归版
function flatten(array) {
  let res = []
  for (let item of array) {
    if (Array.isArray(item)) {
      res = res.concat(flatten(item))
    } else {
      res.push(item)
    }
  }
  return res
}

// 迭代版
function flatten(array) {
  let res = []
  let queue = [array]
  while (queue.length) {
    let temp = queue.pop()
    for (let item of temp) {
      if (Array.isArray(item)) {
        queue.unshift(item)
      } else {
        res.push(item)
      }
    }
  }
  return res
}

// 函数柯里化
function curry(fn) {
  let len = fn.length
  return f()
  
  function f(args) {
    return function() {
      let arr = args || []
      arr.push(...arguments)
      if (arr.length < len) {
        return f(arr)
      } else {
        return fn.apply(this, arr)
      }
    }
  }
}

// 函数组合
function compose(...funcs) {
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

// 洗牌算法
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let random = Math.floor(Math.random() * (i + 1))
    [array[random], array[i]] = [array[i], array[random]]
  }
  return array
}

// 二叉树的遍历 (非递归版)

// 前序遍历
function prevOrder(root) {
  let res = []
  let stack = [root]

  while (stack.length) {
    let node = stack.pop()
    res.push(node.val)
    // 先入栈的元素后输出 
    if (node.right) {
      stack.push(node.right)
    }
    if (node.left) {
      stack.push(node.left)
    }
  }

  return res
}

// 中序遍历
function inOrder(root) {
  let res = []
  let stack = []
  let node = root

  while (stack.length || node) {
    if (node) {
      stack.push(node)
      node = node.left
    } else {
      node = stack.pop()
      res.push(node.val)
      node = node.right
    }
  }

  return res
}

// 后序遍历
function postOrder(root) {
  let res = []
  let stack = [root]

  while (stack.length) {
    let node = stack.pop()
    res.push(node.val)
    // 先入栈的元素后输出
    if (node.left) {
      stack.push(node.left)
    }
    if (node.right) {
      stack.push(node.right)
    }
  }
  
  return res.reverse()
}

// 手写 EventEmitter
class EventEmitter {
  constructor() {
    this.events = {}
  }

  on(type, handler) {
    if (!this.events[type]) {
      this.events[type] = []
    }
    this.events[type].push(handler)
  }

  once(type, handler) {
    let self = this
    function fn() {
      handler.apply(null, arguments)
      self.off(type, fn)
    }
    this.on(type, fn)
  }

  off(type, handler) {
    if (this.events[type]) {
      let index = this.events[type].indexOf(handler)
      if (index != -1) {
        this.events[type].splice(index, 1)
      }
    }
  }

  emit(type, data) {
    if (this.events[type]) {
      this.events[type].forEach(handler => handler(data))
    }
  }
}

// 手写 koa-compose
function compose(middlewares) {
  return function (context) {
    let i = -1
    return dispatch()

    function dispatch() {
      i++
      if (i < middlewares.length) {
        let fn = middlewares[i]
        try {
          return Promise.resolve(fn(context, dispatch))
        } catch (err) {
          return Promise.reject(err)
        }
      } else {
        return Promise.resolve()
      }
    }
  }
}

// 手写 Promise.all
Promise._all = promises => {
  let { length } = promises
  let count = 0
  let res = []

  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(item => {
          res[index] = item
          count++
          if (count == length) {
            resolve(res)
          }
        })
        .catch(err => reject(err))
    })
  })
}

// 手写 Promise.race
Promise._race = promises => new Promise((resolve, reject) => {
  promises.forEach(promise => {
    Promise.resolve(promise).then(resolve, reject)
  })
})

// 手写 Promise.finally
Promise.prototype.finally = function (callback) {
  return this.then(
    res => Promise.resolve(callback()).then(() => res),
    err => Promise.resolve(callback()).then(() => { throw err })
  )
}

// monad
// functor