import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import mongoose, { Model, Types } from 'mongoose';
import { CreateTrackDto } from './create-track.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name) private TrackModel: Model<TrackDocument>,
  ) {}

  @Post()
  async create(@Body() trackData: CreateTrackDto) {
    try {
      return await this.TrackModel.create({
        album: trackData.album,
        title: trackData.title,
        duration: trackData.duration,
        trackNumber: trackData.trackNumber,
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(error);
      }

      throw error;
    }
  }

  @Get()
  async getAll(@Query('albumId') albumId: string) {
    if (albumId) {
      return this.TrackModel.find({ album: new Types.ObjectId(albumId) });
    } else {
      return this.TrackModel.find();
    }
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const existingTrack = await this.TrackModel.findById(id);

    if (!existingTrack) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    await this.TrackModel.findOneAndDelete({ _id: id });
    return `Track with id ${id} deleted successfully`;
  }
}
