import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Define the current timestamp
    const now = new Date('2025-09-30T21:43:00.000Z');

    // Insert root menu
    const systemManagement = await prisma.menu.create({
        data: {
            name: 'System management',
            depth: 0,
            parentId: null,
            createdAt: now,
            updatedAt: now,
        },
    });

    // Insert first level children
    const parent10 = await prisma.menu.create({
        data: {
            name: 'System management',
            depth: 1,
            parentId: systemManagement.id,
            createdAt: now,
            updatedAt: now,
        },
    });

    const parent11 = await prisma.menu.create({
        data: {
            name: 'User and group management',
            depth: 1,
            parentId: systemManagement.id,
            createdAt: now,
            updatedAt: now,
        },
    });

    const parent12 = await prisma.menu.create({
        data: {
            name: 'Role and permission management',
            depth: 1,
            parentId: systemManagement.id,
            createdAt: now,
            updatedAt: now,
        },
    });

    // Insert second level children under parent 1-0
    await prisma.menu.create({
        data: {
            name: 'System configuration',
            depth: 2,
            parentId: parent10.id,
            createdAt: now,
            updatedAt: now,
        },
    });
    await prisma.menu.create({
        data: {
            name: 'Log management',
            depth: 2,
            parentId: parent10.id,
            createdAt: now,
            updatedAt: now,
        },
    });
    await prisma.menu.create({
        data: {
            name: 'Audit log management',
            depth: 2,
            parentId: parent10.id,
            createdAt: now,
            updatedAt: now,
        },
    });

    // Insert second level children under parent 1-1
    await prisma.menu.create({
        data: {
            name: 'User management',
            depth: 2,
            parentId: parent11.id,
            createdAt: now,
            updatedAt: now,
        },
    });

    // Insert second level children under parent 1-2
    await prisma.menu.create({
        data: {
            name: 'Role management',
            depth: 2,
            parentId: parent12.id,
            createdAt: now,
            updatedAt: now,
        },
    });
    await prisma.menu.create({
        data: {
            name: 'Permission management',
            depth: 2,
            parentId: parent12.id,
            createdAt: now,
            updatedAt: now,
        },
    });

    console.log('Seed data inserted successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });