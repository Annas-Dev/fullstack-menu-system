/*
  Warnings:

  - A unique constraint covering the columns `[parentId]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Menu_parentId_key" ON "public"."Menu"("parentId");
