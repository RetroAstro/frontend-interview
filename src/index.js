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

Function.prototype.myApply = function (context, arr = []) {
  let temp = context || window
  temp.fn = this
  let res = temp.fn(...arr)
  delete temp.fn
  return res
}

Function.prototype.myBind = function (context, ...args1) {
  let temp = this
  return function(...args2) {
    return temp.call(context, ...args1, ...args2)
  }
}

function myNew(fn, ...args) {
  let obj = {}
  Object.setPrototypeOf(obj, fn.prototype)
  let res = fn.call(obj, ...args)
  return typeof res == 'object' ? res : obj
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

