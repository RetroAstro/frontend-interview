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
function flatten(array) {
  let res = []
  let stack = [array]
  while (stack.length) {
    let temp = stack.pop()
    for (let item of temp) {
      if (Array.isArray(item)) {
        stack.unshift(item)
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

// monad
// functor
// 手写 event emitter
// 手写 promise
// 实现 MVVM 双向数据绑定 (Proxy / defineProperty)
