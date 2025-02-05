/*
  Warnings:

  - You are about to drop the column `teacherId` on the `TeachingGroup` table. All the data in the column will be lost.
  - Added the required column `teachingGroupId` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TeachingGroup` DROP FOREIGN KEY `TeachingGroup_teacherId_fkey`;

-- AlterTable
ALTER TABLE `Teacher` ADD COLUMN `teachingGroupId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `TeachingGroup` DROP COLUMN `teacherId`,
    ADD COLUMN `groupDescription` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_teachingGroupId_fkey` FOREIGN KEY (`teachingGroupId`) REFERENCES `TeachingGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
