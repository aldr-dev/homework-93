import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Model, Types } from 'mongoose';
import { Artist, ArtistDocument } from '../../schemas/artist.schema';
import { Album, AlbumDocument } from '../../schemas/album.schema';
import { Track, TrackDocument } from '../../schemas/track.schema';

@ValidatorConstraint({ name: 'idExists', async: true })
@Injectable()
export class IdExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
  ) {}

  async validate(id: string, args: ValidationArguments) {
    const whichModel = args.constraints[0] as string;

    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    if (whichModel === 'user') {
      const user = await this.userModel.findOne({ _id: id });
      return !!user;
    } else if (whichModel === 'artist') {
      const artist = await this.artistModel.findOne({ _id: id });
      return !!artist;
    } else if (whichModel === 'album') {
      const album = await this.albumModel.findOne({ _id: id });
      return !!album;
    } else if (whichModel === 'track') {
      const track = await this.trackModel.findOne({ _id: id });
      return !!track;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    const modelName = args.constraints[0];
    return `This id for model ${modelName} does not exist`;
  }
}

export function IdExists(
  modelName: string,
  validationOptions?: ValidationOptions,
) {
  return function (
    object: { constructor: CallableFunction },
    propertyName: string,
  ) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [modelName],
      validator: IdExistsConstraint,
    });
  };
}
