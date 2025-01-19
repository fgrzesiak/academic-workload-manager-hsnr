import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User, users } from "@workspace/repo";
import { LoginRequest, LoginResponse } from "@workspace/shared";
import * as bcrypt from "bcrypt";

// marks the service as injectable so it can be used by other parts of the application
@Injectable()
export class AuthService {
  // injects the JwtService for generating JWT tokens
  constructor(private readonly jwtService: JwtService) {}

  /**
   * validates the user's credentials by checking the username and password.
   * @param username - the username of the user attempting to log in.
   * @param password - the password the user provided.
   * @returns a Promise that resolves to the user object if credentials are valid, otherwise null.
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    // retrieves the user by their username
    const user = await users.findByUsername(username);
    
    // checks if the password matches the stored password using bcrypt
    if (user && (await bcrypt.compare(password, user.password))) {
      return user; // return the user object if credentials are correct
    }
    
    return null; // return null if credentials are invalid
  }

  /**
   * handles user login by validating credentials and generating a JWT token.
   * @param user - the login request containing the username and password.
   * @returns a Promise that resolves to a login response (LoginResponse) containing a JWT token and user role.
   * @throws HttpException if the credentials are invalid.
   */
  async login(user: LoginRequest): Promise<LoginResponse> {
    // validate the user's credentials
    const validUser = await this.validateUser(user.username, user.password);
    
    // if credentials are invalid, throw an Unauthorized exception
    if (!validUser) {
      throw new HttpException(
        "Die Anmeldeinformationen sind ungültig.", // Error message for invalid credentials
        HttpStatus.UNAUTHORIZED, // HTTP status code for unauthorized
      );
    }
    
    // create the payload for the JWT token
    const payload = {
      username: validUser.username,
      sub: validUser.id, // user id is used as the subject in the token
    };
    
    // return the login response containing the JWT token and user role
    return {
      token: this.jwtService.sign(payload), // generates a JWT token
      role: validUser.role, // user role (e.g., admin, user)
      isPasswordTemporary: validUser.isPasswordTemporary, // flag indicating if the user's password is temporary
    };
  }
}
