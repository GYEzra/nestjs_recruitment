import {
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION } from 'src/decorator/customise';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest();
        const isPublicPermission = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_PERMISSION, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (err || !user) {
            throw err || new UnauthorizedException("Token không hợp lệ");
        }

        const targetMethod = request.method;
        const targetEndpoint = request.route?.path as string;

        const temp = targetEndpoint.startsWith('/api/v1/auth');

        if (temp)
            return user;

        const permissions = user?.permissions ?? [];
        const isExist = permissions.find(permission => permission.method === targetMethod && permission.apiPath === targetEndpoint);

        if (!isExist && !isPublicPermission)
            throw new ForbiddenException("Bạn không có quyền truy cập vào Endpoint này!");

        return user;
    }
}