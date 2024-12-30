import modules from '.'

const serviceMap: { [key: string]: any } = {}

for (const module of modules) {
  try {
    serviceMap[module] = require(`./${module}/service`).default
  } catch (error) {
    console.log(error)
    throw 'Service names are not configured properly'
  }
}

export default serviceMap
