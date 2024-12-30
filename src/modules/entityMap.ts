import modules from '.'

const entityMap: { [key: string]: any } = {}

for (const module of modules) {
  try {
    entityMap[module] = require(`./${module}/entity`).default
  } catch (error) {
    console.log(error)
    throw 'Entity names are not configured properly'
  }
}

export default entityMap
