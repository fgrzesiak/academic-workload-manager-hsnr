import { PrismaClient } from "@workspace/database";
import { singleton } from "tsyringe";

/**
 * PrismaService class extends the PrismaClient to handle database connections.
 * It ensures the connection is established when the service is instantiated.
 */
@singleton()
export class PrismaService extends PrismaClient {
  constructor() {
    super();  // Initialize the PrismaClient
    void this.$connect();  // Establish the database connection asynchronously
  }
}
