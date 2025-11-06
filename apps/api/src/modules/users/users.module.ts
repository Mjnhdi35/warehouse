import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { BcryptService } from '../../common';
import { PASSWORD_HASHER } from '../auth/interfaces/password-hasher.interface';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: PASSWORD_HASHER, useClass: BcryptService },
  ],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
