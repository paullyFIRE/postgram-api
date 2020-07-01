import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${process.env.AUTH0_DOMAIN}.well-known/jwks.json`,
            }),
            jwtFromRequest: ExtractJwt.fromHeader('x-user'),
            audience: process.env.AUTH0_AUDIENCE,
            issuer: process.env.AUTH0_DOMAIN,
            algorithms: ['RS256'],
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findOneByAuth0Ref(payload.sub)

        if(!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND)

        return payload;
    }
}