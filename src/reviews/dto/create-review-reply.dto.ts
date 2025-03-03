import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewReplyDto {
  @ApiProperty({
    description: 'Reply text',
    example: 'Thank you for your review!',
  })
  @IsString()
  @IsNotEmpty()
  replyText: string;
}
