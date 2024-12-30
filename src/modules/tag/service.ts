import { API_EVENTS, controller } from './controller'
import Store from '../../lib/store'

interface Service {
  [apiEventKey: string]: (req: any, res: any, next?: any) => any
}

const store = new Store(controller)

const service: Service = {
  [API_EVENTS['LIST_' + controller]]: async (req, res, next) => {
    const items = await store.list(req.params)
    res.json(items)
  },
  [API_EVENTS['POST_' + controller]]: async (req, res, next) => {
    const item = await store.insert({ ...req.params, ...req.body })
    res.json(item)
  },
  [API_EVENTS['PUT_' + controller]]: async (req, res, next) => {
    const item = await store.upsert({ ...req.params, ...req.body })
    res.json(item)
  },
  [API_EVENTS['GET_' + controller]]: async (req, res, next) => {
    const item = await store.get(req.params)
    res.json(item)
  },
  [API_EVENTS['DELETE_' + controller]]: async (req, res, next) => {
    if (await store.delete(req.params)) {
      res.send('OK')
    } else {
      res.send('BAD')
    }
  }
}

export default service
