import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublished: boolean;

  @IsString()
  @IsNotEmpty()
  thumbnailUrl: string;
}
