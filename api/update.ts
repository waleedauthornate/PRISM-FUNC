import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://brain:yYrUPbXLRRK4jBXe8-J4xQ@brainedge-dev-15631.7tt.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full",
    },
  },
});

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { privyId } = req.query;
    const { username, email, walletSigner, avatarId } = req.body;

    if (!privyId) {
      return res.status(400).json({ error: "Privy ID is required" });
    }

    try {
      const existingUser = await prisma.prismUser.findFirst({
        where: { privyId },
      });

      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await prisma.prismUser.update({
        where: { id: existingUser.id },
        data: {
          username: username || existingUser.username,
          email: email || existingUser.email,
          walletSigner: walletSigner || existingUser.walletSigner,
          avatarId: avatarId || existingUser.avatarId,
        },
      });

      return res
        .status(204)
        .json({ message: "User updated", user: updatedUser });
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
