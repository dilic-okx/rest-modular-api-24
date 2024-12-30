import fs from 'fs'
import path from 'path'
import express from 'express'

const tools: any[] = fs
  .readdirSync(path.resolve(__dirname, './'), { withFileTypes: true })
  .filter((itm: any) => itm.isDirectory())
  .map((itm: any) => itm.name)

export default tools

const entityMap: { [key: string]: any } = {}
const serviceMap: { [key: string]: any } = {}
const controllerMap: { [key: string]: any } = {}

for (const tool of tools) {
  try {
    entityMap[tool] = require(`./${tool}/entity`).default
  } catch (error) {
    console.log(error)
    throw 'Tool entity names are not configured properly'
  }
  try {
    serviceMap[tool] = require(`./${tool}/service`).default
  } catch (error) {
    console.log(error)
    throw 'Tool service names are not configured properly'
  }
  try {
    controllerMap[tool] = require(`./${tool}/controller`).default
  } catch (error) {
    console.log(error)
    throw 'Tool controller names are not configured properly'
  }
}

export const connectToolControllers = (app: any) => {
  for (const toolName of tools) {
    const router = express.Router() as any
    const moduleEntity = entityMap[toolName]
    const moduleService = serviceMap[toolName]
    for (const [apiKey, api] of Object.entries(controllerMap[toolName])) {
      const { path, method } = api as { path: string; method: string }
      const service = moduleService[apiKey]
      console.log(`--method`, method, path, service)
      router[method.toLowerCase()](path, service)
    }
    console.log(`/tools/${toolName}`)
    app.use(`/tools/${toolName}`, router)
  }
}
