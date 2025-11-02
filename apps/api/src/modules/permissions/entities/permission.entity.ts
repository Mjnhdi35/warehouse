import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CoreEntity } from '../../../common/base/base.entity';

@Entity({ name: 'permissions' })
export class PermissionEntity extends CoreEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;
}
