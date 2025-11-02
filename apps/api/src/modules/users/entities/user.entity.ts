import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CoreEntity } from '../../../common/base/base.entity';

@Entity({ name: 'users' })
export class UserEntity extends CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'display_name' })
  displayName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone?: string;
}
