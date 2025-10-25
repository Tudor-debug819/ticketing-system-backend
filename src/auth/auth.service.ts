import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private users: UsersService, private jwt: JwtService) { }

    async validateUser(email: string, password: string) {
        const user = await this.users.findByEmail(email);
        if (!user || !user.password_hash) throw new UnauthorizedException('Invalid credentials');

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    async signToken(user: any) {
        const payload = { sub: String(user.id), role: user.role, email: user.email };
        return this.jwt.signAsync(payload, {
            secret: process.env.JWT_SECRET || 'dev_secret_change_me',
            expiresIn: '7d',
        });
    }
}
