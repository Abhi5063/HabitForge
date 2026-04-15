import { IsString, IsIn, IsNumber, Min, Max, MinLength, MaxLength, IsOptional } from 'class-validator'

export class CreatePathDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  goal: string // e.g. "Learn C++ from scratch to intermediate level"

  @IsIn([30, 90, 180, 365])
  durationDays: number // 1 month=30, 3 months=90, 6 months=180, 1 year=365

  @IsNumber()
  @Min(15)
  @Max(480)
  dailyMinutes: number // how many minutes per day user can dedicate

  @IsString()
  @IsOptional()
  currentLevel?: string // beginner | intermediate | advanced (optional context)

  @IsString()
  @IsOptional()
  additionalContext?: string // any extra info about user's background
}
