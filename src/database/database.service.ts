import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { AuthService } from 'src/auth/auth.service';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
    private readonly logger = new Logger(DatabaseService.name);

    constructor(
        @InjectModel(Role.name) private permissionModel: SoftDeleteModel<RoleDocument>,
        @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
        private authService: AuthService
    ) { }

    onModuleInit() {
        this.logger.log('OK');
    }

}
