/*
  Warnings:

  - You are about to alter the column `hours` on the `TeachingEvent` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `TeachingEvent` MODIFY `hours` DOUBLE NOT NULL;
