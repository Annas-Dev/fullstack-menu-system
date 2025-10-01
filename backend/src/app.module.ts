import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenusModule } from './menus/menus.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule, MenusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
