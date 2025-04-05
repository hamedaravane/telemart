import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Store } from './store.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum SocialMediaPlatform {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  X = 'x',
  TIKTOK = 'tiktok',
  YOUTUBE = 'youtube',
  TELEGRAM = 'telegram',
  WEBSITE = 'website',
  OTHER = 'other',
}

@Entity('social_links')
@Index(['store', 'platform'], { unique: true })
export class SocialMediaLink {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne(() => Store, (store) => store.socialMediaLinks, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: () => Store })
  store: Store;

  @Column({ type: 'enum', enum: SocialMediaPlatform })
  @ApiProperty({ enum: SocialMediaPlatform })
  platform: SocialMediaPlatform;

  @Column()
  @ApiProperty({ example: 'https://instagram.com/yourstore' })
  url: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false, example: 'Main IG page' })
  label?: string;
}
