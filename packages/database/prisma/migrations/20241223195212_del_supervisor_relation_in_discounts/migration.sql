/*
  Warnings:

  - You are about to drop the column `disabilityDegree` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `projectName` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `supervisorId` on the `Discount` table. All the data in the column will be lost.
  - Added the required column `description` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supervisor` to the `Discount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Discount` DROP FOREIGN KEY `Discount_supervisorId_fkey`;

-- AlterTable
ALTER TABLE `Discount` DROP COLUMN `disabilityDegree`,
    DROP COLUMN `projectName`,
    DROP COLUMN `supervisorId`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `supervisor` VARCHAR(191) NOT NULL;
