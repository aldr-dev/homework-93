import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ArtistDocument = Artist & Document;

@Schema()
export class Artist {
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop()
  information: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
