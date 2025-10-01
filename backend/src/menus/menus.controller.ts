import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MenusService } from './menus.service';

@Controller('menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) { }

    @Get()
    async getMenus() {
        return this.menusService.getMenus();
    }

    @Post()
    async createMenu(@Body() body: { name: string; parentId?: number }) {
        const { name, parentId } = body;
        return this.menusService.createMenu(name, parentId);
    }

    @Put(':id')
    async updateMenu(@Param('id') id: string, @Body() body: { name: string; parentId?: number }) {
        const { name, parentId } = body;
        return this.menusService.updateMenu(Number(id), name, parentId);
    }

    @Delete(':id')
    async deleteMenu(@Param('id') id: string) {
        await this.menusService.deleteMenu(Number(id));
        return { message: 'Menu deleted successfully' };
    }
}