import {
  Controller,
  Delete,
  Post,
  Req,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { TokenAuthGuard } from '../auth/token-auth.guard';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post()
  async registerUser(@Req() req: Request) {
    try {
      const user = new this.userModel({
        email: req.body.email,
        password: req.body.password,
        displayName: req.body.displayName,
      });

      user.generateToken();

      return await user.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(error);
      }

      throw error;
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  async login(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(TokenAuthGuard)
  @Delete('sessions')
  async logout(@Req() req: Request) {
    const headerValue = req.get('Authorization');

    if (!headerValue) return false;

    const [, token] = headerValue.split(' ');

    if (!token) return false;

    const user = await this.userModel.findOne({ token });

    if (!user) return false;

    user.generateToken();
    await user.save();
    return { message: `User ${user.email} logged in successfully!` };
  }
}
