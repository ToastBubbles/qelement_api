import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/services/user.service';
import { greenColor, purpleColor, resetColor } from 'src/interfaces/general';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: any, res: Response, next: NextFunction) {
    console.log(`${purpleColor}in da user mw${resetColor}`);

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    try {
      const decodedToken = this.jwtService.verify(token);

      let userData = await this.usersService.findOneById(decodedToken.id);

      if (!userData) {
        return res.status(403).json({
          message: 'Forbidden: User not found',
        });
      }
      console.log('User data:', userData);

      // Check if the decoded token has admin privileges
      if (
        decodedToken &&
        (userData.role === 'user' ||
          userData.role === 'trusted' ||
          userData.role === 'admin')
      ) {
        console.log(
          `${purpleColor}########################################################${resetColor}`,
        );
        console.log(
          `${purpleColor}Allowing passage for ${decodedToken.username} through ${req.originalUrl} at user level${resetColor}`,
        );
        console.log(
          `${purpleColor}########################################################${resetColor}`,
        );

        req.user = decodedToken; // Attach user information to the request

        return next(); // Continue to the next middleware or route handler
      } else {
        return res.status(403).json({
          message: 'Forbidden: User privileges or higher are required',
        });
      }
    } catch (error) {
      //   console.log(error);

      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    // console.log('middleware', req, res);
  }
}
