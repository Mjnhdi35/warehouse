import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CoreEntity } from '../../../common/base/base.entity';

@Entity({ name: 'roles' })
export class RoleEntity extends CoreEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;
}
