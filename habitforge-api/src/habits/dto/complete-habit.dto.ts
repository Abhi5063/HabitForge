import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

export class CompleteHabitDto {
  @IsString()
  @IsNotEmpty()
  habitId: string

  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'Note must be at most 300 characters' })
  note?: string
}
