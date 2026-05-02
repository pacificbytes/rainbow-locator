'use server';

import { Item, } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * Securely saves a file to the public/uploads directory.
 */
async function saveFile(file: File): Promise<string> {
  // Ensure upload directory exists
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }

  // Server-side security checks
  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    throw new Error('Unsupported file format');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5MB limit');
  }

  // Generate unique filename to prevent collisions and sanitization issues
  const extension = path.extname(file.name) || `.${file.type.split('/')[1]}`;
  const fileName = `${crypto.randomUUID()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}

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
  image?: File;
  ownerId: string;
}) {
  let imagePath = null;
  if (item.image && item.image.size > 0) {
    imagePath = await saveFile(item.image);
  }

  await prisma.item.create({
    data: {
      title: item.title,
      description: item.description,
      category: item.category,
      type: item.type,
      location: item.location,
      date: item.date,
      image: imagePath,
      ownerId: item.ownerId,
      status: 'open',
    },
  });
  redirect('/items');
}

/**
 * Edits an existing item in the database.
 */
export async function editItem(item: Partial<Item> & { id: string; imageFile?: File }) {
  let imagePath = item.image;

  if (item.imageFile && item.imageFile.size > 0) {
    imagePath = await saveFile(item.imageFile);
  }

  await prisma.item.update({
    where: { id: item.id },
    data: {
      title: item.title,
      description: item.description,
      category: item.category,
      type: item.type,
      location: item.location,
      date: item.date,
      image: imagePath,
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
