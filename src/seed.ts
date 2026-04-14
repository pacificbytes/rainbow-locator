import { Role } from "@prisma/client";
import { hash } from "bcrypt";
import config from "../config/settings.development.json";
import { prisma } from "./lib/prisma";

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);

  // Seed Users
  for (const account of config.defaultAccounts) {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        name: account.name,
        password,
        role,
      },
      create: {
        name: account.name,
        email: account.email,
        password,
        role,
      },
    });
  }

  // Seed Items
  for (const itemData of config.defaultItems) {
    console.log(`  Adding item: ${itemData.title}`);
    const owner = await prisma.user.findUnique({
      where: { email: itemData.owner },
    });

    if (owner) {
      // Check if item already exists to avoid duplicate seeds
      const existingItem = await prisma.item.findFirst({
        where: { title: itemData.title, ownerId: owner.id }
      });
      
      if (!existingItem) {
        await prisma.item.create({
          data: {
            title: itemData.title,
            description: itemData.description,
            category: itemData.category,
            type: itemData.type,
            location: itemData.location,
            date: new Date(itemData.date),
            status: 'open',
            ownerId: owner.id,
          },
        });
      }
    } else {
      console.error(`  Owner ${itemData.owner} not found for item ${itemData.title}`);
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
