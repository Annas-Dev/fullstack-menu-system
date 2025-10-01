import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Menu, Prisma } from '@prisma/client';
@Injectable()
export class MenusService {
    constructor(private prisma: PrismaService) { }

    async getMenus(): Promise<any[]> {
        const allMenus = await this.prisma.menu.findMany({
            include: { children: true },
        }) as Prisma.MenuGetPayload<{ include: { children: true } }>[];

        console.log('Fetched all menus:', allMenus); // Debug log

        const rootMenus = allMenus.filter(menu => menu.parentId === null);
        return rootMenus.map(menu => this.buildTreeNode(menu, allMenus));
    }

    private buildTreeNode(menu: any, allMenus: any[]): any {
        console.log('Building node for:', menu);

        const node = {
            title: menu.name,
            key: `menu-${menu.id}`,
            depth: menu.depth,
            parentId: menu.parentId,
            children: menu.children && Array.isArray(menu.children) && menu.children.length > 0
                ? menu.children.map(child => this.buildTreeNode(child, allMenus))
                : undefined,
        };

        const additionalChildren = allMenus.filter(m => m.parentId === menu.id &&
            (!menu.children || !menu.children.some((c: any) => c.id === m.id)));
        if (additionalChildren.length > 0) {
            node.children = node.children || [];
            node.children.push(...additionalChildren.map(child => this.buildTreeNode(child, allMenus)));
        }

        return node;
    }

    async createMenu(name: string, parentId?: number): Promise<any> {
        const depth = parentId ? await this.calculateDepth(parentId) + 1 : 0;
        const menu = await this.prisma.menu.create({
            data: { name, depth, parentId },
        });
        return { title: menu.name, key: `menu-${menu.id}`, children: [] };
    }

    async updateMenu(id: number, name: string, parentId?: number): Promise<any> {
        // Calculate new depth if parentId changes
        const oldMenu = await this.prisma.menu.findUnique({ where: { id } });
        const newDepth = parentId && parentId !== oldMenu?.parentId
            ? await this.calculateDepth(parentId) + 1
            : oldMenu?.depth;

        const updatedMenu = await this.prisma.menu.update({
            where: { id },
            data: { name, parentId, depth: newDepth },
        });
        return { title: updatedMenu.name, key: `menu-${updatedMenu.id}`, children: [] };
    }

    async deleteMenu(id: number): Promise<void> {
        // Delete the menu and its subtree recursively
        await this.prisma.menu.delete({
            where: { id },
        });
        // Note: Prisma doesn't support cascading delete for relations automatically;
        // we need to handle subtree deletion manually or rely on DB constraints
        // For now, we'll assume ON DELETE CASCADE is set (adjust schema if needed)
    }

    private async calculateDepth(parentId: number): Promise<number> {
        const parent = await this.prisma.menu.findUnique({ where: { id: parentId } });
        return parent ? parent.depth : 0;
    }

    private findParentKey(parentId: number): string {
        return `menu-${parentId}`;
    }
}