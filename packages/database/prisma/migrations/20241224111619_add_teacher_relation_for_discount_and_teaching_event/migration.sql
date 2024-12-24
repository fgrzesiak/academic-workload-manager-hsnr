/*
  Warnings:

  - Added the required column `teacherId` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `TeachingEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Discount` ADD COLUMN `teacherId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `TeachingEvent` ADD COLUMN `teacherId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeachingEvent` ADD CONSTRAINT `TeachingEvent_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
