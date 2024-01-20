import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/user.interface';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { BadRequestException } from '@nestjs/common/exceptions'
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private rolesService: RolesService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid === true) {
                const userRole = user.role as unknown as { _id: string, name: string };
                const temp = await this.rolesService.findOne(userRole._id);

                return {
                    ...user.toObject(),
                    permissions: temp?.permissions ?? []
                };
            }
        }
        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role, permissions } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        }

        const refresh_token = this.createRefreshToken(payload);

        await this.usersService.updateUserToken(_id, refresh_token);

        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
        })

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
                permissions
            }
        };
    }

    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) / 1000
        });

        return refresh_token;
    }

    async register(regsiterUserDto: RegisterUserDto) {
        let user = await this.usersService.register(regsiterUserDto);

        return {
            _id: user?._id,
            createdAt: user?.createdAt
        };
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            })

            const user = await this.usersService.findUserByToken(refreshToken);

            if (user) {
                const { _id, name, email, role } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role
                }

                const refresh_token = this.createRefreshToken(payload);
                const userRole = user.role as unknown as { _id: string, name: string };
                const temp = await this.rolesService.findOne(userRole._id);

                await this.usersService.updateUserToken(_id.toString(), refresh_token);

                response.clearCookie("refresh_token");
                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
                })

                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role,
                        permissions: temp?.permissions ?? []
                    }
                };
            } else {
                throw new BadRequestException("Token không hợp lệ")
            }
        } catch (error) {
            throw new BadRequestException("Token không hợp lệ")
        }
    }

    logout = async (user: IUser, response: Response) => {
        await this.usersService.updateUserToken(user._id, null);
        response.clearCookie("refresh_token");
        return "OK"
    }
}
