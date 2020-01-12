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

