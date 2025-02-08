import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Review } from './review.entity';

export enum ReportReason {
  SPAM = 'Spam',
  INAPPROPRIATE = 'Inappropriate Content',
  FAKE_REVIEW = 'Fake Review',
  HARASSMENT = 'Harassment or Hate Speech',
  OFFENSIVE_LANGUAGE = 'Offensive or Abusive Language',
  MISLEADING_INFORMATION = 'Misleading or False Information',
  PRIVACY_VIOLATION = 'Privacy Violation (Personal Information)',
  COPYRIGHT_INFRINGEMENT = 'Copyright or Trademark Violation',
  SCAM = 'Scam or Fraudulent Activity',
  UNAUTHORIZED_ADVERTISING = 'Unauthorized Advertising or Promotion',
  IRRELEVANT_CONTENT = 'Irrelevant or Off-Topic Content',
  BULLYING = 'Bullying or Threats',
  VIOLENCE = 'Violence or Dangerous Content',
  SELF_PROMOTION = 'Excessive Self-Promotion',
  ILLEGAL_ACTIVITY = 'Illegal or Unlawful Content',
  OTHER = 'Other',
}

@Entity({ name: 'review_reports' })
export class ReviewReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Review, (review) => review.reports, { onDelete: 'CASCADE' })
  review: Review;

  @ManyToOne(() => User, { eager: true })
  reportedBy: User;

  @Column({ type: 'enum', enum: ReportReason })
  reason: ReportReason;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn()
  reportedAt: Date;
}
