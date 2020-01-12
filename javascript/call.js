Function.prototype.mycall1 = function (context) {
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

Function.prototype.mycall2 = function (context, ...args) {
  let temp = context || window
  temp.fn = this
  let res = temp.fn(...args)
  delete temp.fn
  return res
}

Function.prototype.myapply = function (context, arr = []) {
  let temp = context || window
  temp.fn = this
  let res = temp.fn(...arr)
  delete temp.fn
  return res
}

Function.prototype.mybind = function (context, ...args1) {
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
