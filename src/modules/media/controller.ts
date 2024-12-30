export const controller = 'media'

export const API_EVENTS = {
  ['SEARCH_' + controller]: 'SEARCH_' + controller,
  ['GET_' + controller]: 'GET_' + controller,
  ['LIST_' + controller]: 'LIST_' + controller,
  ['POST_' + controller]: 'POST_' + controller,
  ['PUT_' + controller]: 'PUT_' + controller,
  ['PATCH_' + controller]: 'PATCH_' + controller,
  ['DELETE_' + controller]: 'DELETE_' + controller
}

const api = {
  [API_EVENTS['SEARCH_' + controller]]: {
    method: 'POST',
    path: '/src'
  },
  [API_EVENTS['GET_' + controller]]: {
    method: 'GET',
    path: '/:id'
  },
  [API_EVENTS['LIST_' + controller]]: {
    method: 'GET',
    path: '/'
  },
  [API_EVENTS['POST_' + controller]]: {
    method: 'POST',
    path: '/'
  },
  [API_EVENTS['PUT_' + controller]]: {
    method: 'PUT',
    path: '/:id'
  },
  [API_EVENTS['PATCH_' + controller]]: {
    method: 'PATCH',
    path: '/:id'
  },
  [API_EVENTS['DELETE_' + controller]]: {
    method: 'DELETE',
    path: '/:id'
  }
}

export default api
