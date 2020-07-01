import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { CheckAuthDto } from './dtos/check-auth.dto';
import { IgApiClient } from 'instagram-private-api';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepo.findOne(id);
  }

  findOneByAuth0Ref(auth0UserRef: string): Promise<User> {
    return this.userRepo.findOne({
      where: {
        auth0UserRef,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }

  async create(user: CreateUserDto): Promise<User> {
    const [_, count] = await this.userRepo.findAndCount({
      where: {
        email: user.email,
      },
    });

    if (count > 0) throw new HttpException('', HttpStatus.SEE_OTHER);

    return this.userRepo.save(user);
  }

  async update(id: string, newUser: UpdateUserDto): Promise<UpdateResult> {
    return this.userRepo.update(id, newUser);
  }

  async checkAuth(credentials: CheckAuthDto): Promise<void> {
    const { instagramUsername, instagramPassword } = credentials;

    const ig = new IgApiClient();
    ig.state.generateDevice(instagramUsername);
    await ig.account.login(instagramUsername, instagramPassword);

    ig.simulate.postLoginFlow().finally(() => ig.destroy());

    return null;
  }
}
