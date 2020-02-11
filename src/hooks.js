let state = []
let setters = []
let firstRun = true
let cursor = 0

function createSetter(cursor) {
  return function (newVal) {
    state[cursor] = newVal
  }
}

function useState(initVal) {
  if (firstRun) {
    state.push(initVal)
    setters.push(createSetter(cursor))
    firstRun = false
  }

  let value = state[cursor]
  let setter = setters[cursor]

  cursor++

  return [value, setter]
}

function RenderComponent() {
  let [name, setName] = useState('Barry')
  let [age, setAge] = useState(18)

  return (
    <div>
      <Button onClick={() => setName('Leo')}>{name}</Button>
      <Button onClick={() => setAge(20)}>{age}</Button>
    </div>
  )
}

function MyComponent() {
  cursor = 0
  return <RenderComponent />
}

MyComponent() // first render

console.log(state) // ['Barry', 18]

MyComponent() // rerender

console.log(state) // ['Barry', 18]

// Click Two Buttons

console.log(state) // ['Leo', 20]

