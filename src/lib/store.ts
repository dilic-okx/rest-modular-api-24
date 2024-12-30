export interface StoreInterface {
  list: (data?: any) => Promise<any[]>
  search?: (data: any) => Promise<any[]>
  get: (data: any) => Promise<any | undefined>
  delete: (data: any) => Promise<boolean>
  insert: (data: any) => Promise<any>
  upsert: (data: any) => Promise<any>
  update: (data: any) => Promise<any>
}

export enum StoreAction {
  LIST = 'LIST',
  SEARCH = 'SEARCH',
  GET = 'GET',
  DELETE = 'DELETE',
  INSERT = 'INSERT',
  UPSERT = 'UPSERT',
  UPDATE = 'UPDATE'
}

const storeEngine = process.env.STORE || 'json'
export default require(`./store-engine/${storeEngine}`).default
