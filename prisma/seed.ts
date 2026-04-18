import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const data = JSON.parse(readFileSync(resolve('db.json'), 'utf-8'));

async function seed() {
    await prisma.blankets.createMany({ data: data.blankets });
}

seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
