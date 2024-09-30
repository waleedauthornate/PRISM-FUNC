import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DB_URL,
    },
  },
});
// change
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, email, privyId, walletSigner, avatarId } = req.body;
    console.log("username: " + username);
    console.log("email: " + email);
    console.log("walletSigner: " + walletSigner);
    console.log("privyId: " + username);
    console.log("avatarId: " + avatarId);

    if (!username && !email) {
      return res.status(400).json({ error: "Username or email is required" });
    }

    try {
      // Check if the user already exists
      const existingUser = await prisma.prismUser.findFirst({
        where: {
          OR: [
            { username: username ?? undefined },
            { email: email ?? undefined },
          ],
        },
      });

      if (existingUser) {
        return res
          .status(200)
          .json({ message: "Welcome back!", user: existingUser });
      }

      // Create a new user if one doesn't exist
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
      return res
        .status(500)
        .json({ error: "Something went wrong", details: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
