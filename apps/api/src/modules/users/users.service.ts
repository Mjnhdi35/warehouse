import {
  ConflictException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import {
  PASSWORD_HASHER,
  PasswordHasher,
} from '../auth/interfaces/password-hasher.interface';
import { generateRandomPassword, extractEmailUsername } from '../../common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  async create(body: CreateUserDto) {
    const { email, password, ...data } = body;
    const existingUser = await this.usersRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Duplicated!');
    }
    const hashPass = await this.passwordHasher.hash(password);
    const newUser = this.usersRepo.create({
      email,
      password: hashPass,
      ...data,
    });
    const saveUser = await this.usersRepo.save(newUser);
    return this.usersRepo.findOneByOrFail({ id: saveUser.id });
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) {
      throw new NotFoundException('Not Found!');
    }
    return user;
  }

  async findAll() {
    return this.usersRepo.find();
  }

  async findOneById(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Not Found!');
    return user;
  }

  async update(id: string, body: UpdateUserDto) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Not Found!');
    if (body.email && body.email !== user.email) {
      const dup = await this.usersRepo.findOne({
        where: { email: body.email },
      });
      if (dup) throw new ConflictException('Duplicated!');
    }
    if (body.password) {
      body.password = await this.passwordHasher.hash(body.password);
    }
    const merged = this.usersRepo.merge(user, body);
    const saved = await this.usersRepo.save(merged);
    return this.findOneById(saved.id);
  }

  async remove(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Not Found!');
    await this.usersRepo.remove(user);
    return { success: true };
  }

  async findOneByEmailOrCreate(email: string, data?: Partial<UserEntity>) {
    try {
      const user = await this.findOneByEmail(email);
      return user;
    } catch {
      const randomPassword = generateRandomPassword();
      const hashPass = await this.passwordHasher.hash(randomPassword);

      const newUser = this.usersRepo.create({
        email,
        displayName: data?.displayName || extractEmailUsername(email),
        avatar: data?.avatar,
        phone: data?.phone,
        password: hashPass,
      });
      return this.usersRepo.save(newUser);
    }
  }
}
