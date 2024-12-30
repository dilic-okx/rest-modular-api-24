import express from 'express'
import url from 'url'
import Utils from './utils'
import { StoreAction } from './store'
import Validator, { propertySchema } from './validator'
import modules from '../modules'
import entityMap from '../modules/entityMap'
import serviceMap from '../modules/serviceMap'
import controllerMap from '../modules/controllerMap'

export default class Rest {
  public static express = express

  public static createRouter = () => (routingContext: any) => {
    const router = express.Router()
  }

  public static getControllerPath = (moduleName: string) => `/${moduleName}`

  public static defaulHandler = (req: any, res: any) => {
    res.status(404).json({ errors: ' Not Implemented' })
  }

  public static validatorMiddleware =
    (entity: any) => async (req: any, res: any, next: any) => {
      if (!entity) {
        console.log('The entity is null')
        next()
        return
      }
      const result = await Validator.validate(
        new entity({ ...req.params, ...req.body })
      )
      result.error === null
        ? next()
        : res.status(422).json({ errors: result.error })

      if (result.error) {
        const { clr } = Utils
        console.error(
          clr(
            `\n--- Error:\n    ${result.error
              .map((er: any) => er.message)
              .join(`\n    `)}`,
            '31'
          )
        )
      }
    }

  static methodActionMap: any = {
    LIST: StoreAction.LIST,
    SEARCH: StoreAction.SEARCH,
    GET: StoreAction.GET,
    POST: StoreAction.INSERT,
    PUT: StoreAction.UPSERT,
    PATCH: StoreAction.UPDATE,
    DELETE: StoreAction.DELETE
  }

  static noValidateActions: StoreAction[] = [
    StoreAction.LIST,
    StoreAction.SEARCH,
    StoreAction.GET,
    StoreAction.DELETE
  ]

  static addPKActions: StoreAction[] = [StoreAction.GET, StoreAction.DELETE]

  private static schema: any = {}

  public static connectControllers = (app: any) => {
    for (const moduleName of modules) {
      const router = express.Router() as any
      const moduleEntity = entityMap[moduleName]
      const moduleService = serviceMap[moduleName]
      Rest.schema[moduleName] = {}
      for (const [apiKey, api] of Object.entries(controllerMap[moduleName])) {
        const { path, method } = api as { path: string; method: string }
        const actionKey: StoreAction =
          Rest.methodActionMap[apiKey.split('_').shift() || '']
        if (
          !Object.values(StoreAction).includes(
            actionKey as unknown as StoreAction
          )
        ) {
          throw new Error(`Action key "${actionKey}" not recognized`)
        }
        const entity = !moduleEntity[actionKey] ? null : moduleEntity[actionKey]
        const service = !moduleService[apiKey]
          ? Rest.defaulHandler
          : moduleService[apiKey]

        if (!Rest.schema[moduleName][actionKey]) {
          Rest.schema[moduleName][actionKey] = {
            endpoint: `/${moduleName}${path}`,
            method
          }
        }
        if (
          entity &&
          Rest.addPKActions.includes(actionKey) &&
          moduleEntity[StoreAction.INSERT]
        ) {
          const scm = propertySchema(moduleEntity[StoreAction.INSERT])
          Rest.schema[moduleName][actionKey].pkInfo = Object.keys(scm).filter(
            (k) => scm[k].includes('isPK')
          )
        }
        if (entity && !Rest.noValidateActions.includes(actionKey)) {
          Rest.schema[moduleName][actionKey].schema = propertySchema(entity)
          router[method.toLowerCase()](
            path,
            Rest.validatorMiddleware(entity),
            service
          )
        } else {
          router[method.toLowerCase()](path, service)
        }
      }
      app.use(Rest.getControllerPath(moduleName), router)
    }

    const router = express.Router() as any
    router.get('/get-api-config', (req: any, res: any, next: any) => {
      res.json(Rest.schema)
    })
    app.use('', router)
  }

  private static sess: any = {}
  public static logRequest = (req: any, res: any) => {
    if (!Rest.sess.s) {
      Rest.sess.s = 0
    }
    const { clr } = Utils
    Rest.sess.s++
    const queryObject = req.url ? { ...url.parse(req.url, true).query } : {}
    const ip =
      req.headers?.['x-forwarded-for']?.split(',').shift() ||
      req.socket?.remoteAddress?.split(':').pop() ||
      null
    const stat: number = res.statusCode ? parseInt(res.statusCode, 10) : 200
    const statColor: string = stat < 300 ? '32' : stat < 400 ? '93' : '31'
    const methodColor: string =
      req.method === 'GET'
        ? '32'
        : req.method === 'POST'
        ? '33'
        : req.method === 'PUT'
        ? '94'
        : req.method === 'DELETE'
        ? '41'
        : '37'
    console.log('')
    console.log(
      clr('--- ' + (Rest.sess.s + '').padStart(5, '0'), statColor),
      clr('[', '90'),
      clr(ip, statColor),
      clr(']', '90')
    )
    console.log(
      '    req:',
      clr(req.method, methodColor),
      clr(req.url, '37'),
      clr(
        '{ ' +
          Object.keys(queryObject)
            .map((ik: string) => ik + ': ' + queryObject[ik])
            .join('; ') +
          ' }',
        '90'
      )
    )
    console.log(
      '    res:',
      clr(res.statusCode, statColor) /*,
      clr(res.statusMessage, '90')*/
    )
  }
}
