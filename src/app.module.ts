import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsController } from './artists/artists.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { Album, AlbumSchema } from './schemas/album.schema';
import { AlbumsController } from './albums/albums.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/musicApp'),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
    ]),
  ],
  controllers: [AppController, ArtistsController, AlbumsController],
  providers: [AppService],
})
export class AppModule {}
