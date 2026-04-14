'use server';

import { Item, Claim } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

/**
 * Adds a new item to the database.
 */
export async function addItem(item: {
  title: string;
  description: string;
  category: string;
  type: string;
  location: string;
  date: Date;
  image?: string;
  ownerId: string;
}) {
  await prisma.item.create({
    data: {
      title: item.title,
      description: item.description,
      category: item.category,
      type: item.type,
      location: item.location,
      date: item.date,
      image: item.image,
      ownerId: item.ownerId,
      status: 'open',
    },
  });
  redirect('/items');
}

/**
 * Edits an existing item in the database.
 */
export async function editItem(item: Partial<Item> & { id: string }) {
  await prisma.item.update({
    where: { id: item.id },
    data: {
      title: item.title,
      description: item.description,
      category: item.category,
      type: item.type,
      location: item.location,
      date: item.date,
      image: item.image,
      status: item.status,
    },
  });
  redirect('/items');
}

/**
 * Deletes an existing item from the database.
 */
export async function deleteItem(id: string) {
  await prisma.item.delete({
    where: { id },
  });
  redirect('/items');
}

/**
 * Adds a new claim for an item.
 */
export async function addClaim(claim: { itemId: string; userId: string; message: string }) {
  await prisma.claim.create({
    data: {
      itemId: claim.itemId,
      userId: claim.userId,
      message: claim.message,
      status: 'pending',
    },
  });
  // When a claim is added, we could potentially mark the item as 'pending'
  await prisma.item.update({
    where: { id: claim.itemId },
    data: { status: 'pending' },
  });
  redirect('/my-stuff');
}

/**
 * Updates the status of a claim.
 */
export async function updateClaimStatus(id: string, status: string) {
  const claim = await prisma.claim.update({
    where: { id },
    data: { status },
    include: { item: true },
  });

  // If claim is approved, mark the item as resolved
  if (status === 'approved') {
    await resolveItem(claim.itemId);
  }
}

/**
 * Marks an item as resolved.
 */
export async function resolveItem(id: string) {
  await prisma.item.update({
    where: { id },
    data: { status: 'resolved' },
  });
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password, name.
 */
export async function createUser(credentials: { email: string; password: string; name: string }) {
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
      name: credentials.name,
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}
