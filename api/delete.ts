import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://brain:yYrUPbXLRRK4jBXe8-J4xQ@brainedge-dev-15631.7tt.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full",
    },
  },
});

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { privyId } = req.query;
    console.log("Privy ID received in request:", privyId);

    if (!privyId) {
      console.error("Error: No Privy ID provided in the request.");
      return res.status(400).json({ error: "Privy ID is required" });
    }

    try {
      // Log before querying the database
      console.log(`Querying database for user with privyId: ${privyId}`);

      const user = await prisma.prismUser.findFirst({
        where: { privyId },
      });

      // Log the user found or not
      if (!user) {
        console.error(`User with privyId: ${privyId} not found.`);
        return res.status(404).json({ error: "User not found" });
      }

      console.log(`User found: ${JSON.stringify(user)}`);

      // Attempt to delete the user
      await prisma.prismUser.delete({
        where: { id: user.id },
      });

      console.log(`User with id: ${user.id} successfully deleted.`);
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error occurred during deletion:", error);

      return res.status(500).json({
        error: "An unexpected error occurred",
        details: error.message,
        stack: error.stack,
      });
    }
  } else {
    console.error("Invalid method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }
}
