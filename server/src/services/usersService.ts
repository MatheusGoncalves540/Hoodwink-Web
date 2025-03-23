import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/userEntity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  create(userData: Partial<User>): Promise<User> | null {
    try {
      if (!userData.email) {
        throw new Error('Email é obrigatório');
      }

      const user = this.usersRepository.create(userData);
      return this.usersRepository.save(user);
    } catch (error) {
      console.log(error)
      throw new Error("Erro ao criar usuário")
    }
  }
}
