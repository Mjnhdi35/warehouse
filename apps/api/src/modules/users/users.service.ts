import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/user.dto';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  async create(body: CreateUserDto) {
    const { email, password, ...data } = body;
    const existingUser = await this.findByEmail(email);
    if (!existingUser) {
      throw new ConflictException('Duplicated!');
    }
    const hashPass = await hash(
      password,
      +this.configService.getOrThrow<number>('SALTS'),
    );
    const newUser = this.usersRepo.create({
      email,
      password: hashPass,
      ...data,
    });
    const saveUser = await this.usersRepo.save(newUser);
    return saveUser;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepo.find({ where: { email } });
    if (!user) {
      throw new NotFoundException('Not Found!');
    }
    return user;
  }

  async getAll() {
    return await this.usersRepo.find();
  }
}
