export const controller = 'scraper'

export const API_EVENTS = {
  ['GET_' + controller]: 'GET_' + controller,
  ['POST_' + controller]: 'POST_' + controller,
  ['PUT_' + controller]: 'PUT_' + controller,
  ['PATCH_' + controller]: 'PATCH_' + controller
}

const api = {
  [API_EVENTS['GET_' + controller]]: {
    method: 'GET',
    path: '/:url'
  },
  [API_EVENTS['POST_' + controller]]: {
    method: 'POST',
    path: '/'
  },
  [API_EVENTS['PUT_' + controller]]: {
    method: 'PUT',
    path: '/:url'
  },
  [API_EVENTS['PATCH_' + controller]]: {
    method: 'PATCH',
    path: '/:url'
  }
}

export default api
