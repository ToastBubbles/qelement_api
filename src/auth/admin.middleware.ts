import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/services/user.service';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: any, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    // console.log('here');
    // console.log(token);

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    try {
      const decodedToken = this.jwtService.verify(token);
      //   console.log(decodedToken);
      let userData = await this.usersService.findOneById(decodedToken.id);

      // Check if the decoded token has admin privileges
      if (decodedToken && userData.role === 'admin') {
        req.user = decodedToken; // Attach user information to the request
        return next(); // Continue to the next middleware or route handler
      } else {
        return res
          .status(403)
          .json({ message: 'Forbidden: Admin privileges required' });
      }
    } catch (error) {
      //   console.log(error);

      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    // console.log('middleware', req, res);
  }
}
