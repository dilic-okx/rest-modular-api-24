import path from 'path'
import * as fs from 'fs/promises'
import crypto from 'crypto'
import { StoreInterface, StoreAction } from '../store'
import entityMap from '../../modules/entityMap'
import Validator from '../validator'

export default class JsonStorage implements StoreInterface {
  private entity: any
  private storePath: string
  private serviceProps: any = {
    createTs: 'createdAt',
    updateTs: 'updatedAt',
    softDeleteTs: 'deletedAt'
  }
  constructor(entityName: string) {
    const entity = entityMap[entityName]
    if (!entity) {
      throw new Error(`Invalid entity name "${entityName}" provided`)
    }
    this.entity = entity
    this.storePath = path.resolve(
      __dirname,
      `../../../${process.env.STORE_JSON_DIR || 'store'}/${entityName}.json`
    )
  }
  private listStorage = async (): Promise<any[]> => {
    let items: any[] = []
    try {
      items = JSON.parse(
        await fs.readFile(this.storePath, { encoding: 'utf-8' })
      )
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      console.log(e)
      throw new Error('Unknown error')
    }
    return items
  }
  private writeStorage = async (content: string): Promise<any> => {
    let res: any
    try {
      res = await fs.writeFile(this.storePath, content, { encoding: 'utf-8' })
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      console.log(e)
      throw new Error('Unknown error')
    }
    return res
  }
  private getStorage = async (pk: string | string[]): Promise<any[]> => {
    const items = await this.listStorage()
    let fnd = (itm: any) => itm.id === pk
    if (pk.length) {
      if (pk.length === 0) {
        throw new Error('PK array not provided')
      }
      //fnd = (itm) => pk.map((pkVal) =>)
    }
    return items.find((itm) => itm.id === pk)
  }
  private now = () => new Date().toISOString()
  private insertStorage = async (data: any): Promise<any> => {
    const InsertClass = this.entity[StoreAction.INSERT]
    const items = await this.listStorage()
    const pk = data.pk || 'id'
    const pkVal = crypto.randomUUID()
    delete data[pk]
    const newItem = new InsertClass({
      [pk]: pkVal,
      ...data,
      [this.serviceProps.createTs]: this.now(),
      [this.serviceProps.updateTs]: this.now()
    })
    const result = await Validator.validate(newItem)
    if (result.error !== null) {
      return result.error
    }
    items.push(newItem)
    this.writeStorage(JSON.stringify(items))
    return items.find((itm) => itm[pk] === pkVal)
  }
  private upsertStorage = async (data: any): Promise<any> => {
    const UpsertClass = this.entity[StoreAction.UPSERT]
    const items = await this.listStorage()
    const pk = data.pk || 'id'
    if (!data[pk]) {
      throw new Error('PK not provided')
    }
    const item = new UpsertClass({
      ...data,
      [this.serviceProps.createTs]: this.now(),
      [this.serviceProps.updateTs]: this.now()
    })
    const result = await Validator.validate(item)
    if (result.error !== null) {
      return result.error
    }
    const index = items.findIndex((itm) => itm[pk] === data[pk])
    if (index > -1) {
      items[index] = item
    } else {
      items.push(item)
    }
    this.writeStorage(JSON.stringify(items))
    return items.find((itm) => itm[pk] === data[pk])
  }
  private updateStorage = async (data: any): Promise<any> => {
    const UpdateClass = this.entity[StoreAction.UPDATE]
    const items = await this.listStorage()
    const pk = data.pk || 'id'
    if (!data[pk]) {
      throw new Error('PK not provided')
    }
    const original = items.find((itm) => itm[pk] === data[pk])
    if (!original) {
      return { notfound: 404 }
    }
    const item = new UpdateClass({
      ...original,
      ...data,
      [this.serviceProps.createTs]: original[this.serviceProps.createTs],
      [this.serviceProps.updateTs]: this.now()
    })
    const result = await Validator.validate(item)
    if (result.error !== null) {
      return result.error
    }
    const index = items.findIndex((itm) => itm[pk] === data[pk])
    items[index] = item
    this.writeStorage(JSON.stringify(items))
    return items.find((itm) => itm[pk] === data[pk])
  }
  private deleteStorage = async (data: any): Promise<any> => {
    const items = await this.listStorage()
    const pk = data.pk || 'id'
    if (!data[pk]) {
      throw new Error('PK not provided')
    }
    const original = items.find((itm) => itm[pk] === data[pk])
    if (!original) {
      return false
    }

    this.writeStorage(
      JSON.stringify(items.filter((itm) => itm[pk] !== data[pk]))
    )
    return true
  }
  public list = async (data?: any): Promise<any[]> => {
    let items = await this.listStorage()
    for (const paramKey of Object.keys(data || {})) {
      items = items.filter((itm) => itm[paramKey] === data[paramKey])
    }
    return items
  }
  public get = async (data: any): Promise<any | undefined> => {
    const pk = data.pk || data.id
    if (!pk) {
      throw new Error(`PK not provided`)
    }
    return this.getStorage(pk)
  }
  public insert = async (data: any): Promise<any> => {
    return this.insertStorage(data)
  }
  public upsert = async (data: any): Promise<any> => {
    return this.upsertStorage(data)
  }
  public update = async (data: any): Promise<any> => {
    return this.updateStorage(data)
  }
  public delete = async (data: any): Promise<boolean> => {
    return await this.deleteStorage(data)
  }
}
