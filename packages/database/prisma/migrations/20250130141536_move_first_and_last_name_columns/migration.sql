/*
  Warnings:

  - You are about to drop the column `firstName` on the `Controller` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Controller` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Teacher` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add nullable columns to User
ALTER TABLE `User` ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NULL;

-- Step 2: Copy firstName and lastName from Teacher to User
UPDATE `User` u
JOIN `Teacher` t ON u.id = t.userId
SET u.firstName = t.firstName, u.lastName = t.lastName
WHERE u.firstName IS NULL;

-- Step 3: Copy firstName and lastName from Controller to User if missing
UPDATE `User` u
JOIN `Controller` c ON u.id = c.userId
SET u.firstName = c.firstName, u.lastName = c.lastName
WHERE u.firstName IS NULL;

-- Step 4: Drop firstName and lastName from Teacher and Controller
ALTER TABLE `Teacher` DROP COLUMN `firstName`, DROP COLUMN `lastName`;
ALTER TABLE `Controller` DROP COLUMN `firstName`, DROP COLUMN `lastName`;

-- Step 5: Make firstName and lastName NOT NULL
ALTER TABLE `User` MODIFY COLUMN `firstName` VARCHAR(191) NOT NULL,
    MODIFY COLUMN `lastName` VARCHAR(191) NOT NULL;
