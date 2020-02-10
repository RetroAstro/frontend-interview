class Dep {
  constructor() {
    this.subs = []
  }
  addSub(sub) {
    let index = this.subs.indexOf(sub)
    if (index == -1) {
      this.subs.push(sub)
    }
  }
  notify() {
    this.subs.forEach(sub => sub.update())
  }
}

Dep.target = null

class Watcher {
  constructor(obj, key, cb) {
    Dep.target = this
    this.cb = cb
    this.obj = obj
    this.key = key
    this.value = obj[key]
    Dep.target = null
  }
  update() {
    let newVal = this.obj[this.key]
    if (this.value != newVal) {
      this.value = newVal
      this.cb(this.value)
    }
  }
}

function isObject(obj) {
  return typeof obj == 'object' && obj != null
}

function observe(obj) {
  if (!isObject(obj)) {
    return 
  }

  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

function defineReactive(obj, key, val) {
  observe(val)
  let dep = new Dep()
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return val
    },
    set: (newVal) => {
      if (val == newVal) {
        return
      }
      val = newVal
      observe(newVal)
      dep.notify()
    }
  })
}

function render(value) {
  console.log('render: ' + value)
}

let data = { text: 'retroastro' }

observe(data)

new Watcher(data, 'text', render)

data.text = 'Barry Allen'

