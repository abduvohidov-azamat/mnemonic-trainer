import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('sessions')
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.sessions, { onDelete: 'CASCADE', nullable: true })
  user: UserEntity;

  @Column()
  discipline: string; // 'numbers' | 'cards' | 'words'

  @Column('simple-json')
  config: Record<string, any>;

  @Column('simple-json')
  targetSequence: any;

  @Column('simple-json')
  recallSequence: any;

  @Column('float')
  accuracy: number; // 0 to 100

  @Column('float')
  score: number;

  @Column('int')
  totalCorrect: number;

  @Column('int')
  totalItems: number;

  @Column('int')
  durationMs: number;

  @Column('float', { nullable: true })
  speedDpm: number; // Digits or cards per minute

  @Column('simple-json', { nullable: true })
  diffBreakdown: any;

  @CreateDateColumn()
  createdAt: Date;
}
