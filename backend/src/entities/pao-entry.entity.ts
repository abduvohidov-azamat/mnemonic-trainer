import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Unique } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('pao_entries')
@Unique(['user', 'key'])
export class PaoEntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.paoEntries, { onDelete: 'CASCADE', nullable: true })
  user: UserEntity;

  @Column()
  key: string; // e.g. "00", "01", ... "99", or card key like "AS", "KH", "10D"

  @Column({ default: 'number' })
  type: 'number' | 'card';

  @Column({ default: '' })
  person: string;

  @Column({ default: '' })
  action: string;

  @Column({ default: '' })
  object: string;

  @Column({ default: '' })
  notes: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: false })
  isCustom: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
