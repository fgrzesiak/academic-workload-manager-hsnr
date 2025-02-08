import { Injectable, UnauthorizedException } from "@nestjs/common";
// imports necessary NestJS utilities
import { PassportStrategy } from "@nestjs/passport";
// Passport strategy to integrate with JWT
import { User, users } from "@workspace/repo";
// imports user model and repository for querying user data
import { ExtractJwt, Strategy } from "passport-jwt";

// imports utilities to handle JWT extraction and validation
import {
  ConfigKeys,
  ConfigService,
} from "../../modules/config/config.service.js";

// imports configuration keys and service for retrieving config

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // specifies the method to extract the JWT token from the request's Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // sets the secret key used to validate the JWT token
      secretOrKey: configService.get(ConfigKeys.JWT_SECRET),
    });
  }

  /**
   * validates the payload of the JWT token.
   * this function is called after the token is successfully extracted and decoded.
   * @param payload - the decoded JWT payload, containing user info (e.g., user id).
   * @returns the user object if valid, or throws an UnauthorizedException if user not found.
   */
  async validate(payload: any): Promise<User> {
    const { sub } = payload; // retrieves the 'sub' field from the payload, which is the user ID
    const user = await users.findOne(sub); // fetches the user from the database based on the user ID (sub)

    // if no user is found, throws an UnauthorizedException, blocking access
    if (!user) {
      throw new UnauthorizedException();
    }

    // returns the user object if found
    return user;
  }
}
