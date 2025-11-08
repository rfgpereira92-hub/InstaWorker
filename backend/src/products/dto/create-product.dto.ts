import { IsArray, IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  title!: string;
  @IsNotEmpty()
  brand!: string;
  @IsNotEmpty()
  model!: string;
  @IsInt()
  year!: number;
  @IsInt()
  mileage_km!: number;
  @IsNumberString()
  price!: string;
  @IsNotEmpty()
  fuel_type!: string;
  @IsNotEmpty()
  gearbox!: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];
}

