import { Controller, Get, Body, Post, Put, HttpException, HttpStatus, HttpCode, ForbiddenException } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Auth } from 'src/decorators/auth.decorator';
import { DUser } from 'src/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiBadRequestResponse, ApiConflictResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { CheckUserDto } from './dtos/check-user.dto';
import { CreatedUserResponseDto } from './dtos/created-user-response.dto';
import { CheckAuthDto } from './dtos/check-auth.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    @Auth()
    @ApiOperation({ summary: 'Get current user.' })
    async getUser(@DUser() user: User): Promise<User> {
        return user
    }

    @Put()
    @Auth()
    @ApiOperation({ summary: 'Update user record.' })
    async update(@DUser() user: User, @Body() updatedUser: UpdateUserDto): Promise<User> {
        await this.userService.update(user.id, updatedUser)

        return this.userService.findOne(user.id)
    }

    @Post('/checkauth')
    @Auth()
    @ApiOperation({ summary: 'Validate a credential set.' })
    async validate(@Body() credentials: CheckAuthDto): Promise<void> {
        try {
            await this.userService.checkAuth(credentials)
            return
        } catch(err) {
            throw new ForbiddenException('Invalid credentials.')
        }
    }

    @Post('preregister')
    @HttpCode(200)
    @ApiOperation({ summary: 'Auth0 pre-registration route to validate an Auth0 user does not already exist.' })
    @ApiBadRequestResponse()
    @ApiConflictResponse({ description: 'User already exists.' })
    async auth0CheckUserExists(@Body() checkUser: CheckUserDto): Promise<void> {
        const existingUser = await this.userService.findOneByAuth0Ref(checkUser.auth0UserRef)
        if(existingUser) throw new HttpException('User already exists.', HttpStatus.CONFLICT)

        return
    }

    @Post('postregister')
    @ApiOperation({ summary: 'Auth0 post-registration route to create local user record.' })
    @ApiBadRequestResponse()
    @ApiConflictResponse({ description: 'User already exists.' })
    async auth0RegisterUser(@Body() newUserDto: CreateUserDto): Promise<CreatedUserResponseDto> {
        const existingUser = await this.userService.findOneByAuth0Ref(newUserDto.auth0UserRef)
        if(existingUser) throw new HttpException('User with that ref already exists.', HttpStatus.CONFLICT)

        const newUser = await this.userService.create(newUserDto)

        return {
            userId: newUser.id
        }
    }
}
