import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customise';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Req, Res } from '@nestjs/common/decorators';
import { Response, Request } from 'express';
import { IUser } from 'src/users/user.interface';

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @ResponseMessage("Người dùng đăng nhập")
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    async handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }

    @ResponseMessage("Người dùng đăng ký")
    @Public()
    @Post('register')
    handleRegister(@Body() regsiterUserDto: RegisterUserDto) {
        return this.authService.register(regsiterUserDto);
    }

    @ResponseMessage("Lấy thông tin người dùng")
    @Get("account")
    handleGetAccount(@User() user: IUser) {
        return { user };
    }

    @ResponseMessage("Lấy thông tin người dùng từ Refresh Token")
    @Public()
    @Get("refresh")
    handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refresh_token = request.cookies["refresh_token"];
        return this.authService.processNewToken(refresh_token, response);
    };

    @ResponseMessage("Đăng xuất")
    @Post("logout")
    handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
        return this.authService.logout(user, response);
    }
}
