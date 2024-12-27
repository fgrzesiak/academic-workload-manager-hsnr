-- DropForeignKey
ALTER TABLE `Discount` DROP FOREIGN KEY `Discount_commentId_fkey`;

-- DropForeignKey
ALTER TABLE `Supervision` DROP FOREIGN KEY `Supervision_commentId_fkey`;

-- AlterTable
ALTER TABLE `Discount` MODIFY `commentId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Supervision` MODIFY `commentId` INTEGER NULL;

-- AlterTable
ALTER TABLE `TeachingEvent` ADD COLUMN `commentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`commentId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supervision` ADD CONSTRAINT `Supervision_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`commentId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeachingEvent` ADD CONSTRAINT `TeachingEvent_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`commentId`) ON DELETE SET NULL ON UPDATE CASCADE;
