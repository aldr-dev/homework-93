import { IsMongoId, IsNotEmpty } from 'class-validator';
import { IdExists } from '../global/validators/id-exists-validator';

export class CreateAlbumDto {
  @IsMongoId()
  @IdExists('artist')
  artist: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  dataRelease: number;

  image: string | null;
}
