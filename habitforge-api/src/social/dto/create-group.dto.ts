import { IsString, IsOptional, IsBoolean, IsNumber, Min, MinLength, MaxLength, Matches, IsISO8601 } from 'class-validator'

export class CreateGroupDto {
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  name: string

  @IsString()
  @IsOptional()
  @MaxLength(300)
  description?: string

  @IsString()
  @IsOptional()
  @Matches(/\p{Emoji}/u, { message: 'Icon must be an emoji' })
  icon?: string

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean

  @IsNumber()
  @Min(100)
  @IsOptional()
  targetXP?: number

  @IsISO8601()
  @IsOptional()
  endsAt?: string
}
