import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        const user = await this.auth.validateUser(dto.email, dto.password);
        const token = await this.auth.signToken(user);

        return {
            token,
            user: {
                id: user.id.toString(),
                email: user.email,
                full_name: user.full_name,
                role: user.role,
            },
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('session')
    async session(@Req() req: any) {
        return { user: req.user, offline: false };
    }
}
