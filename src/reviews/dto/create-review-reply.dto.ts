import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewReplyDto {
  @IsString()
  @IsNotEmpty({ message: 'Reply text cannot be empty' })
  replyText: string;
}
