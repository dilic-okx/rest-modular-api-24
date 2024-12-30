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

class CharacterInsertDto {
  @IsOptional()
  @IsUnique()
  @IsUUID()
  @IsPK()
  id?: string

  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @IsBoolean()
  isStarred?: boolean

  @IsOptional()
  @IsUrl()
  url?: string

  @IsOptional()
  @IsUrl()
  photo?: string

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

class CharacterUpsertDto {
  @IsUUID()
  @IsPK()
  id!: string

  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @IsBoolean()
  isStarred?: boolean

  @IsOptional()
  @IsUrl()
  url?: string

  @IsOptional()
  @IsUrl()
  photo?: string

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

class CharacterUpdateDto {
  @IsUUID()
  @IsPK()
  id!: number

  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @IsBoolean()
  isStarred?: boolean

  @IsOptional()
  @IsUrl()
  url?: string

  @IsOptional()
  @IsUrl()
  photo?: string

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
//type Keys = keyof CharacterInterface

class Character {
  id!: number
  name!: string
  firstName?: string
  lastName?: string
  isStarred?: boolean
  url?: string
  photo?: string
  rate?: number
  data?: { [key: string]: any }
  constructor(data?: Partial<any>) {
    Object.assign(this, data)
  }
}

export default {
  [StoreAction.SEARCH]: Character,
  [StoreAction.LIST]: Character,
  [StoreAction.GET]: Character,
  [StoreAction.DELETE]: Character,
  [StoreAction.INSERT]: CharacterInsertDto,
  [StoreAction.UPSERT]: CharacterUpsertDto,
  [StoreAction.UPDATE]: CharacterUpdateDto
}
