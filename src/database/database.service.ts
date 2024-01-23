import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DatabaseService implements OnModuleInit {
    private readonly logger = new Logger(DatabaseService.name);

    constructor(
        @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
        @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
        @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>,
        private configService: ConfigService,
        private userService: UsersService
    ) { }

    async onModuleInit() {
        const isInit = JSON.parse(this.configService.get<string>('HAS_INIT'));

        if (Boolean(isInit)) {
            const countPermission = await this.permissionModel.count({});
            const countRole = await this.roleModel.count({});
            const countUser = await this.userModel.count({});

            if (countPermission === 0)
                await this.permissionModel.insertMany(INIT_PERMISSIONS);

            if (countRole === 0) {
                const permissions = await this.permissionModel.find({}).select('_id');
                await this.roleModel.insertMany([
                    {
                        "name": ADMIN_ROLE,
                        "description": "Admin full quyền",
                        "isActive": true,
                        "permissions": permissions
                    },
                    {
                        "name": USER_ROLE,
                        "description": "USER không có quyền",
                        "isActive": true,
                        "permissions": []
                    }
                ]);
            }

            if (countUser === 0) {
                const roleAdmin = await this.roleModel.findOne({ name: ADMIN_ROLE });
                const roleUser = await this.roleModel.findOne({ name: USER_ROLE });
                const password = await this.userService.getHashPassword("123");

                await this.userModel.insertMany([
                    {
                        "name": "Người dùng",
                        "email": "user@gmail.com",
                        "password": password,
                        "age": 20,
                        "gender": "Nữ",
                        "address": "TPHCM",
                        "role": roleUser._id,
                    },
                    {
                        "name": "Quản trị viên",
                        "email": "admin@gmail.com",
                        "password": password,
                        "age": 18,
                        "gender": "Nam",
                        "address": "TPHCM",
                        "role": roleAdmin._id,
                    }
                ])

                this.logger.log('Init Data Success');
            }
        }
    }

}
