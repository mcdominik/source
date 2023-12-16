import { IsOptional } from 'class-validator';

export class FilterDto {
  @IsOptional()
  numberOfPages: number = 1;
}
