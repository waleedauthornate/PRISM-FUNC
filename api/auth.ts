import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://brain:yYrUPbXLRRK4jBXe8-J4xQ@brainedge-dev-15631.7tt.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full",
    },
  },
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, email, privyId } = req.body;
    const walletSigner = Math.random().toString().replace(".", "x");
    const avatarId = `https://avatar.iran.liara.run/public/boy?username=${
      username || "hello"
    }`;
    console.log("username: " + username);
    console.log("email: " + email);
    console.log("walletSigner: " + walletSigner);
    console.log("privyId: " + privyId);
    console.log("avatarId: " + avatarId);
    console.log("----");

    if (!username && !email) {
      return res.status(400).json({ error: "Username or email is required" });
    }

    try {
      const existingUser = await prisma.prismUser.findFirst({
        where: {
          privyId: privyId ?? undefined,
        },
      });

      if (existingUser) {
        return res
          .status(200)
          .json({ message: "Welcome back!", user: existingUser });
      }

      const newUser = await prisma.prismUser.create({
        data: {
          username,
          email,
          privyId,
          walletSigner,
          avatarId,
        },
      });

      return res.status(201).json({ message: "User created", user: newUser });
    } catch (error) {
      console.error("Error occurred:", error);

      if (error.code === "P2002") {
        return res
          .status(409)
          .json({ error: "A user with this information already exists" });
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json({
          error: "Database error",
          details: error.message,
        });
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
          error: "Validation error",
          details: error.message,
        });
      }

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
