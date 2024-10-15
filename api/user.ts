import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://brain:yYrUPbXLRRK4jBXe8-J4xQ@brainedge-dev-15631.7tt.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full",
    },
  },
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { privyId } = req.query;
    console.log(privyId);

    if (!privyId) {
      return res.status(400).json({ error: "Privy ID is required" });
    }

    try {
      const user = await prisma.prismUser.findFirst({
        where: { privyId },
      });
      console.log(user);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error("Error occurred:", error);

      return res.status(500).json({
        error: "An unexpected error occurred",
        details: error.message,
        stack: error.stack,
      });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
