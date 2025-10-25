import { PrismaClient, user_role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function upsertUser(email: string, full_name: string, role: user_role, password: string) {
    const password_hash = await bcrypt.hash(password, 10);
    return prisma.users.upsert({
        where: { email },
        update: { full_name, role, password_hash },
        create: { email, full_name, role, password_hash },
    });
}

async function main() {
    await upsertUser('admin@test.com', 'Admin User', 'admin', 'admin123');
    await upsertUser('client@test.com', 'Client User', 'client', 'client123');
    await upsertUser('technician@test.com', 'Technician User', 'technician', 'technician123');
    console.log('✅ Seed done.');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
