import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DatabaseController],
  providers: [DatabaseService, AuthService, UsersService, JwtService],
  imports: [MongooseModule.forFeature([
    { name: Role.name, schema: RoleSchema },
    { name: User.name, schema: UserSchema }
  ])]
})
export class DatabaseModule { }
