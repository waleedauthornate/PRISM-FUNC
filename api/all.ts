import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://brain:yYrUPbXLRRK4jBXe8-J4xQ@brainedge-dev-15631.7tt.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full",
    },
  },
});

export default async function handler(req, res) {
  console.log(`Received ${req.method} request`);

  if (req.method === "GET") {
    try {
      // Log before fetching all users
      console.log("Fetching all users from the database...");

      const users = await prisma.prismUser.findMany();

      // Log the result of the query
      console.log(`Found ${users.length} users.`);

      // Return the list of users in the response
      return res.status(200).json({ users });
    } catch (error) {
      // Log detailed error message and stack trace
      console.error("Error occurred while fetching users:", error);

      // Return 500 with error details
      return res.status(500).json({
        error: "An unexpected error occurred while fetching users",
        details: error.message,
        stack: error.stack,
      });
    }
  } else {
    // Invalid request method handling
    console.error(`Invalid method: ${req.method}`);
    return res.status(405).json({ error: "Method not allowed" });
  }
}
