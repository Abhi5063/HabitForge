import {
  IsString,
  IsOptional,
  IsIn,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsHexColor,
  IsNotEmpty,
} from 'class-validator'

const VALID_FREQUENCIES = ['DAILY', 'WEEKLY', 'MONTHLY'] as const
type Frequency = (typeof VALID_FREQUENCIES)[number]

export class CreateHabitDto {
  @IsString()
  @MinLength(2, { message: 'Habit title must be at least 2 characters' })
  @MaxLength(60, { message: 'Habit title must be at most 60 characters' })
  @IsNotEmpty()
  title: string

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must be at most 500 characters' })
  description?: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string

  @IsOptional()
  @IsIn(VALID_FREQUENCIES, {
    message: 'Frequency must be DAILY, WEEKLY, or MONTHLY',
  })
  frequency?: Frequency

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10, { message: 'Target count cannot exceed 10' })
  targetCount?: number

  @IsOptional()
  @IsHexColor({ message: 'Color must be a valid hex color (e.g. #FF6B00)' })
  color?: string

  @IsOptional()
  @IsString()
  @MaxLength(10, { message: 'Icon must be a single emoji' })
  icon?: string

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500, { message: 'XP per completion cannot exceed 500' })
  xpPerComplete?: number
}
