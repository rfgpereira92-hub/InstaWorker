import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async signup(name: string, email: string, password: string) {
    const existing = await this.users.findOne({ where: { email } });
    if (existing) throw new UnauthorizedException('Email already used');
    const password_hash = await bcrypt.hash(password, 10);
    const user = this.users.create({ name, email, password_hash });
    await this.users.save(user);
    return this.sign(user);
  }

  async login(email: string, password: string) {
    const user = await this.users.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.sign(user);
  }

  me(user: any) {
    return user;
  }

  private sign(user: User) {
    const payload = { id: user.id, email: user.email, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', {
      expiresIn: '7d',
    });
    return { token, user: payload };
  }
}

