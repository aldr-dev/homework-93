import { IsMongoId, IsNotEmpty } from 'class-validator';
import { IdExists } from '../global/validators/id-exists-validator';

export class CreateTrackDto {
  @IsMongoId()
  @IdExists('album')
  album: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  duration: string;

  @IsNotEmpty()
  trackNumber: number;
}
