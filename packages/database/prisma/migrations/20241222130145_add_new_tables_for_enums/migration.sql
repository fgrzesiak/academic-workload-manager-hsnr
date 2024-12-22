/*
  Warnings:

  - You are about to drop the column `discountType` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `supervisionType` on the `Supervision` table. All the data in the column will be lost.
  - Added the required column `commentId` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountTypeId` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commentId` to the `Supervision` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supervisionTypeId` to the `Supervision` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Discount` DROP COLUMN `discountType`,
    ADD COLUMN `commentId` INTEGER NOT NULL,
    ADD COLUMN `discountTypeId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Supervision` DROP COLUMN `supervisionType`,
    ADD COLUMN `commentId` INTEGER NOT NULL,
    ADD COLUMN `supervisionTypeId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Comment` (
    `commentId` INTEGER NOT NULL AUTO_INCREMENT,
    `commentContent` VARCHAR(191) NOT NULL,
    `commentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`commentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiscountType` (
    `discountTypeId` INTEGER NOT NULL AUTO_INCREMENT,
    `discountType` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`discountTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupervisionType` (
    `typeOfSupervisionId` INTEGER NOT NULL AUTO_INCREMENT,
    `typeOfSupervision` VARCHAR(191) NOT NULL,
    `calculationFactor` DOUBLE NOT NULL,
    `validFrom` INTEGER NOT NULL,

    PRIMARY KEY (`typeOfSupervisionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_discountTypeId_fkey` FOREIGN KEY (`discountTypeId`) REFERENCES `DiscountType`(`discountTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`commentId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supervision` ADD CONSTRAINT `Supervision_supervisionTypeId_fkey` FOREIGN KEY (`supervisionTypeId`) REFERENCES `SupervisionType`(`typeOfSupervisionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supervision` ADD CONSTRAINT `Supervision_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`commentId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupervisionType` ADD CONSTRAINT `SupervisionType_validFrom_fkey` FOREIGN KEY (`validFrom`) REFERENCES `SemesterPeriod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
