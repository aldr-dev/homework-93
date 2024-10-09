import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import mongoose, { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArtistDto } from './create-artist.dto';
import { storage } from '../multer';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name) private ArtistModel: Model<ArtistDocument>,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage }))
  async create(
    @Body() artistData: CreateArtistDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.ArtistModel.create({
        name: artistData.name,
        image: file ? 'images/' + file.filename : null,
        information: artistData.information,
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(error);
      }

      throw error;
    }
  }

  @Get()
  async getAll() {
    return this.ArtistModel.find();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const artist = await this.ArtistModel.findOne({ _id: id });

    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    return artist;
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const existingArtist = await this.ArtistModel.findById(id);

    if (!existingArtist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    await this.ArtistModel.findOneAndDelete({ _id: id });
    return `Artist with id ${id} deleted successfully`;
  }
}
