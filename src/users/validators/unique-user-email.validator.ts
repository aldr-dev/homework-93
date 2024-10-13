import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Model } from 'mongoose';

@ValidatorConstraint({ name: 'UniqueUserEmail', async: true })
@Injectable()
export class UniqueUserEmailConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async validate(email: string) {
    const user = await this.userModel.findOne({ email });
    return !user;
  }

  defaultMessage(): string {
    return 'This email is already registered';
  }
}

export function UniqueUserEmail(validationOptions?: ValidationOptions) {
  return function (
    object: { constructor: CallableFunction },
    propertyName: string,
  ) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueUserEmailConstraint,
    });
  };
}
