import {
  validate,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  getMetadataStorage,
  ValidationTypes
} from 'class-validator'
import Store from './store'

@ValidatorConstraint({ async: true })
export class isUnique implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const { targetName, property } = args
    const storeName = targetName
      .toLowerCase()
      .replace(/upsertdto/g, '')
      .replace(/updatedto/g, '')
      .replace(/insertdto/g, '')
      .replace(/dto/g, '')
    const store = new Store(storeName)
    const items = await store.list()
    return items.find((itm: any) => itm[property] === value) ? false : true
  }
}

export const IsUnique = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} is not unique`,
        ...validationOptions
      },
      constraints: [],
      validator: isUnique
    })
  }
}

@ValidatorConstraint({ async: true })
export class isPK implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    return value && value.length > 0
  }
}

export const IsPK = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `PK ${propertyName} not provided`,
        ...validationOptions
      },
      constraints: [],
      validator: isPK
    })
  }
}

export const propertySchema = (targetClass: Function) => {
  const metadataStorage = getMetadataStorage()
  const targetMetadatas = metadataStorage.getTargetValidationMetadatas(
    targetClass,
    '',
    false,
    false,
    undefined
  )
  const groupedMetadatas = metadataStorage.groupByPropertyName(targetMetadatas)
  return Object.fromEntries(
    Object.entries(groupedMetadatas).map(([property, decorators]) => {
      const CM = decorators.map((decorator) =>
        decorator.constraintCls
          ? metadataStorage
              .getTargetValidatorConstraints(decorator.constraintCls)
              .map((v) => v.name + (!['object', 'undefined'].includes(typeof decorator.constraints?.[0]) ? '|' + decorator.constraints.join('|') : '' ))
          : decorator.type === ValidationTypes.CONDITIONAL_VALIDATION
          ? 'isOptional'
          : null
      )
      return [property, CM.flat()]
    })
  )
}

export default class Validator {
  public static formatErrors = (errors: any[]) => {
    return errors.map((er) => ({
      property: er.property,
      message: Object.values(er.constraints).join(', ')
    }))
  }

  public static validate = async (instance: any): Promise<any> => {
    let res: { error: null | any[] } = { error: null }
    try {
      //await validateOrReject(new entity(body), { forbidUnknownValues: true })
      await new Promise((resolve) => {
        validate(instance, { forbidUnknownValues: true }).then((errors) => {
          if (errors.length > 0) {
            res.error = Validator.formatErrors(errors)
          }
          resolve(true)
        })
      })
    } catch (err) {
      //res.error = errors as any[]
      console.log('--err', err)
    }
    return res
  }
}
