class Scheduler {
  constructor() {
    this.tasks = []
    this.usingTasks = []
  }

  add(promiseCreator) {
    return new Promise((resolve) => {
      promiseCreator.resolve = resolve

      if (this.usingTasks.length < 2) {
        this.usingRun(promiseCreator)
      } else {
        this.tasks.push(promiseCreator)
      }
    })
  }

  usingRun(promiseCreator) {
    this.usingTasks.push(promiseCreator)

    promiseCreator()
      .then(() => {
        promiseCreator.resolve()
        this.usingMove(promiseCreator)

        if (this.tasks.length) {
          this.usingRun(this.tasks.shift())
        }
      })
  }

  usingMove(promiseCreator) {
    let index = this.usingTasks.indexOf(promiseCreator)
    this.usingTasks.splice(index, 1)
  }
}

let timeout = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

let scheduler = new Scheduler()

let addTask = (time, order) => {
  scheduler
    .add(() => timeout(time))
    .then(() => console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')

// 2 3 1 4

