function asyncAdd(a, b, callback) {
  setTimeout(() => callback(a + b), Math.random() * 300)
}

(async () => {
  let result1 = await sum(1, 4, 6, 9)
  let result2 = await sum(3, 4, 9, 20, 22)
  let result3 = await sum(1, 6, 10, 15)

  console.log([result1, result2, result3]) // [20, 58, 32]
})()

async function sum(...args) {
  return new Promise(resolve => {
    f.resolve = resolve
    f(args)
  })

  async function f(arr) {
    if (arr.length % 2 != 0) {
      arr.push(0)
    }

    let temp = []

    for (let i = 0; i <= arr.length - 2; i += 2) {
      temp.push(arr.slice(i, i + 2))
    }

    let res = await Promise.all(
      temp.map(([a, b]) => new Promise(resolve => asyncAdd(a, b, resolve)))
    )

    if (res.length > 1) {
      f(res)
    } else {
      f.resolve(res[0])
    }
  }
}

