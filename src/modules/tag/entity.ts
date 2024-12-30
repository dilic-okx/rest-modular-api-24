import { MinLength, MaxLength, IsString } from 'class-validator'
import { IsUnique, IsPK } from '../../lib/validator'
import { StoreAction } from '../../lib/store'

class TagInsertDto {
  @IsString()
  @IsUnique()
  @IsPK()
  @MinLength(2)
  @MaxLength(20)
  tag!: string
}

class TagUpsertDto {
  @IsString()
  @IsPK()
  @MinLength(2)
  @MaxLength(20)
  tag!: string
}

class Tag {
  tag!: string
}

export default {
  [StoreAction.SEARCH]: Tag,
  [StoreAction.LIST]: Tag,
  [StoreAction.GET]: Tag,
  [StoreAction.DELETE]: Tag,
  [StoreAction.INSERT]: TagInsertDto,
  [StoreAction.UPSERT]: TagUpsertDto
}
