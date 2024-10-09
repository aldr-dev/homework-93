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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './create-album.dto';
import { storage } from '../multer';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name) private AlbumModel: Model<AlbumDocument>,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage }))
  async create(
    @Body() albumData: CreateAlbumDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.AlbumModel.create({
        artist: albumData.artist,
        title: albumData.title,
        dataRelease: albumData.dataRelease,
        image: file ? 'images/' + file.filename : null,
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(error);
      }

      throw error;
    }
  }

  @Get()
  async getAll(@Query('artistId') artistId: string) {
    if (artistId) {
      return this.AlbumModel.find({ artist: new Types.ObjectId(artistId) });
    } else {
      return this.AlbumModel.find();
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const album = await this.AlbumModel.findOne({ _id: id });

    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    return album;
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const existingAlbum = await this.AlbumModel.findById(id);

    if (!existingAlbum) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    await this.AlbumModel.findOneAndDelete({ _id: id });
    return `Album with id ${id} deleted successfully`;
  }
}
