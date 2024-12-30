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

class MediaInsertDto {
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

class MediaUpsertDto {
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

class MediaUpdateDto {
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

class Media {
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
  [StoreAction.SEARCH]: Media,
  [StoreAction.LIST]: Media,
  [StoreAction.GET]: Media,
  [StoreAction.DELETE]: Media,
  [StoreAction.INSERT]: MediaInsertDto,
  [StoreAction.UPSERT]: MediaUpsertDto,
  [StoreAction.UPDATE]: MediaUpdateDto
}
