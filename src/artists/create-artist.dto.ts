import { IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
  @IsNotEmpty()
  name: string;

  image: string | null;
  information: string;
}
