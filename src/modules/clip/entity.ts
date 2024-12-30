import {
  IsOptional,
  IsUUID,
  IsString,
  IsBoolean,
  IsUrl,
  IsNumber,
  IsJSON
} from 'class-validator'
import { IsUnique, IsPK } from '../../lib/validator'
import { StoreAction } from '../../lib/store'

class ClipInserDto {
  @IsOptional()
  @IsUnique()
  @IsUUID()
  @IsPK()
  id?: string

  @IsString()
  title!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  source?: string

  @IsOptional()
  @IsBoolean()
  isStarred?: boolean

  @IsOptional()
  @IsUrl()
  url?: string

  @IsOptional()
  @IsUrl()
  thumb?: string

  @IsOptional()
  @IsNumber()
  rate?: number

  @IsOptional()
  @IsJSON()
  data?: { [key: string]: any }

  constructor(data?: Partial<any>) {
    Object.assign(this, data)
  }
}

class ClipUpsertDto {
  @IsUUID()
  @IsPK()
  id!: number

  @IsString()
  title!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  source?: string

  @IsOptional()
  @IsBoolean()
  isStarred?: boolean

  @IsOptional()
  @IsUrl()
  url?: string

  @IsOptional()
  @IsUrl()
  thumb?: string

  @IsOptional()
  @IsNumber()
  rate?: number

  @IsOptional()
  @IsJSON()
  data?: { [key: string]: any }

  constructor(data?: Partial<any>) {
    Object.assign(this, data)
  }
}

class ClipUpdateDto {
  @IsUUID()
  @IsPK()
  id!: number

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  source?: string

  @IsOptional()
  @IsBoolean()
  isStarred?: boolean

  @IsOptional()
  @IsUrl()
  url?: string

  @IsOptional()
  @IsUrl()
  thumb?: string

  @IsOptional()
  @IsNumber()
  rate?: number

  @IsOptional()
  @IsJSON()
  data?: { [key: string]: any }

  constructor(data?: Partial<any>) {
    Object.assign(this, data)
  }
}

class Clip {
  id!: number
  title!: string
  description?: string
  source?: string
  isStarred?: boolean
  url?: string
  thumb?: string
  rate?: number
  data?: { [key: string]: any }

  constructor(data?: Partial<any>) {
    Object.assign(this, data)
  }
}

export default {
  [StoreAction.SEARCH]: Clip,
  [StoreAction.LIST]: Clip,
  [StoreAction.GET]: Clip,
  [StoreAction.DELETE]: Clip,
  [StoreAction.INSERT]: ClipInserDto,
  [StoreAction.UPSERT]: ClipUpsertDto,
  [StoreAction.UPDATE]: ClipUpdateDto
}
