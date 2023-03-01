import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator'

enum Gender {
  MEN = 'men',
  WOMEN = 'women',
  KID = 'kid',
  UNISEX = 'unisex',
}

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number

  @IsString()
  @IsOptional()
  desc?: string

  @IsString()
  @IsOptional()
  slug?: string

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number

  @IsString({ each: true })
  @IsArray()
  sizes: string[]

  @IsEnum(Gender)
  gender: string

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[]

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[]
}
