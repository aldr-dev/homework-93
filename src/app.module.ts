import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsController } from './artists/artists.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { Album, AlbumSchema } from './schemas/album.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/MusicApp'),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
    ]),
  ],
  controllers: [AppController, ArtistsController],
  providers: [AppService],
})
export class AppModule {}
