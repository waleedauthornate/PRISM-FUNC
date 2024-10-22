import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://brain:yYrUPbXLRRK4jBXe8-J4xQ@brainedge-dev-15631.7tt.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full",
    },
  },
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { username, email, privyId, walletSigner, avatarId } = req.body;

      if (!privyId && !email) {
        return res.status(400).json({ error: "Username or email is required" });
      }

      const existingUser = await prisma.prismUser.findFirst({
        where: {
          OR: [
            { privyId: privyId ?? undefined },
            { email: email ?? undefined },
            { username: username ?? undefined },
          ],
        },
      });

      if (existingUser) {
        return res.status(200).json({
          message: "Welcome back!",
          user: existingUser,
        });
      } else {
        const newUser = await prisma.prismUser.create({
          data: {
            username,
            email,
            privyId,
            walletSigner,
            avatarId,
          },
        });
        return res.status(201).json({
          message: "User created",
          user: newUser,
        });
      }
    } catch (err) {
      return res.status(201).json({
        message: "Error creating user",
        error: err,
      });
    }
  } else {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }
}
