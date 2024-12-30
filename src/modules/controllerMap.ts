import modules from '.'

const controllerMap: { [key: string]: any } = {}

for (const module of modules) {
  try {
    controllerMap[module] = require(`./${module}/controller`).default
  } catch (error) {
    console.log(error)
    throw 'Controller names are not configured properly'
  }
}

export default controllerMap
