import { Injectable } from "@nestjs/common";
import "dotenv/config";

// loads environment variables from the .env file
import { ConfigKeys } from "./config-keys.enum.js";

// imports the available configuration keys

// exports ConfigKeys so that other modules can access it
export { ConfigKeys };

@Injectable()
export class ConfigService {
  // stores the environment variables that are used in the application
  private readonly envConfig: Record<string, string | undefined>;

  constructor() {
    // initializes envConfig with environment variables from process.env
    this.envConfig = process.env;

    // validates that all environment variables defined in ConfigKeys are present
    Object.values(ConfigKeys).forEach((key) => {
      if (!this.envConfig[key]) {
        // throws an error if an environment variable is missing
        throw new Error(`Missing environment variable: ${key}`);
      }
    });
  }

  /**
   * retrieves the value of an environment variable based on the key.
   * @param key - the key of the desired environment variable.
   * @returns the value of the environment variable.
   * @throws Error if the environment variable is not found.
   */
  get(key: ConfigKeys): string {
    const value = this.envConfig[key]; // retrieves the value of the environment variable by key.

    if (!value) {
      // throws an error if the environment variable is not set
      throw new Error(`Missing environment variable: ${key}`);
    }

    return value; // returns the value of the environment variable
  }

  /**
   * retrieves the value of an environment variable as a number.
   * if the environment variable doesn't contain a valid numeric value, an error is thrown.
   * @param key - the key of the desired environment variable.
   * @returns the parsed number from the environment variable.
   * @throws Error if the environment variable is not found or if the value is not a valid number.
   */
  getNumber(key: ConfigKeys): number {
    const value = this.get(key); // retrieves the value of the environment variable as a string
    const parsedValue = parseInt(value, 10); // tries to parse the string value into a number

    if (isNaN(parsedValue)) {
      // throws an error if the value is not a valid number
      throw new Error(`Invalid number for environment variable: ${key}`);
    }

    return parsedValue; // returns the parsed number
  }
}
