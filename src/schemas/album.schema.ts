import { Artist } from './artist.schema';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
  })
  artist: Artist;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  dataRelease: number;

  @Prop()
  image: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
