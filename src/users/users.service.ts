import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    findByEmail(email: string) {
        return this.prisma.users.findUnique({ where: { email } });
    }

    findById(id: bigint) {
        return this.prisma.users.findUnique({ where: { id } });
    }
}
