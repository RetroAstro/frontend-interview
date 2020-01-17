class Node {
  constructor(instance) {
    this.instance = instance
    this.child = null
    this.sibling = null
    this.return = null
  }
}

function link(parent, children) {
  if (children == null) {
    children = []
  }

  parent.child = children.reduceRight((prev, next) => {
    let node = new Node(next)
    node.return = parent
    node.sibling = prev
    return node
  }, null)

  return parent.child
}

function doWork(node) {
  console.log(node.instance.name)
  let children = node.instance.render()
  return link(node, children)
}

function walk(node) {
  let root = node
  let curr = node

  while (true) {
    let child = doWork(curr)

    if (child) {
      curr = child
      continue
    }

    if (curr == root) {
      return
    }

    while (!curr.sibling) {
      if (!curr.return || curr.return == root) {
        return
      }
      curr = curr.return
    }

    curr = curr.sibling
  }
}

let a1 = { name: 'a1' }
let b1 = { name: 'b1' }
let b2 = { name: 'b2' }
let b3 = { name: 'b3' }
let c1 = { name: 'c1' }
let c2 = { name: 'c2' }
let d1 = { name: 'd1' }
let d2 = { name: 'd2' }

a1.render = () => [b1, b2, b3]
b1.render = () => null
b2.render = () => [c1]
b3.render = () => [c2]
c1.render = () => [d1, d2]
c2.render = () => null
d1.render = () => null
d2.render = () => null

let host = new Node(a1)

walk(host) // a1, b1, b2, c1, d1, d2, b3, c2

