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
    const { privyId } = req.query;
    console.log(`Query param privyId received: ${privyId}`);

    if (!privyId) {
      console.error("Privy ID not provided in request");
      return res.status(400).json({ error: "Privy ID is required" });
    }

    try {
      console.log(`Fetching user with privyId: ${privyId}`);

      const user = await prisma.prismUser.findFirst({
        where: { privyId },
      });

      console.log(`Result of the user fetch: ${JSON.stringify(user)}`);

      if (!user) {
        console.error(`User with privyId: ${privyId} not found`);
        return res.status(404).json({ error: "User not found" });
      }

      console.log(
        `User with privyId: ${privyId} found: ${JSON.stringify(user)}`
      );
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Error occurred while fetching user:", error);

      return res.status(500).json({
        error: "An unexpected error occurred",
        details: error.message,
        stack: error.stack,
      });
    }
  } else {
    console.error(`Invalid method: ${req.method}`);
    return res.status(405).json({ error: "Method not allowed" });
  }
}
