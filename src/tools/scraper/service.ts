import { API_EVENTS, controller } from './controller'
import Scraper from './entity'

interface Service {
  [apiEventKey: string]: (req: any, res: any, next?: any) => any
}

const service: Service = {
  [API_EVENTS['POST_' + controller]]: async (req, res, next) => {
    const item = 'Comming soon...'
    res.json(item)
  },
  [API_EVENTS['PUT_' + controller]]: async (req, res, next) => {
    const item = 'Comming soon...'
    res.json(item)
  },
  [API_EVENTS['PATCH_' + controller]]: async (req, res, next) => {
    const item = 'Comming soon...'
    res.json(item)
  },
  [API_EVENTS['GET_' + controller]]: async (req, res, next) => {
    const scrpapper = new Scraper(req.params.url)
    try {
      const item = await scrpapper.performAsync()
      //res.json(item)
      res.send(item.data)
    } catch (err) {
      res.send(null)
    }
  }
}

export default service
