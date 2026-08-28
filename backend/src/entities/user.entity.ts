import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { SessionEntity } from './session.entity';
import { PaoEntryEntity } from './pao-entry.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column()
  username: string;

  @Column({ default: false })
  isGuest: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];

  @OneToMany(() => PaoEntryEntity, (pao) => pao.user)
  paoEntries: PaoEntryEntity[];
}
