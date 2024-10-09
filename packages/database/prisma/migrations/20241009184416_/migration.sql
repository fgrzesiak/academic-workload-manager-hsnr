-- CreateTable
CREATE TABLE `Discount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discountType` ENUM('FUNCTION', 'TASK', 'RESEARCH', 'DEVELOPMENT', 'DISABILITY') NOT NULL,
    `semesterPeriodId` INTEGER NOT NULL,
    `ordered` BOOLEAN NOT NULL,
    `approvalDate` DATETIME(3) NOT NULL,
    `supervisorId` INTEGER NOT NULL,
    `disabilityDegree` DOUBLE NOT NULL,
    `projectName` VARCHAR(191) NOT NULL,
    `scope` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Program` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `programName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SemesterPeriod` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supervision` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `semesterPeriodId` INTEGER NOT NULL,
    `supervisionType` ENUM('BACHELOR_THESIS', 'MASTER_THESIS', 'SECOND_EXAMINER', 'INTERNSHIP_SEMESTER') NOT NULL,
    `teacherId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `retirementDate` DATETIME(3) NOT NULL,
    `totalTeachingDuty` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeachingDutyPerSemester` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `individualDuty` DOUBLE NOT NULL,
    `sumBalance` DOUBLE NOT NULL,
    `sumOrderedBalance` DOUBLE NOT NULL,
    `semesterPeriodId` INTEGER NOT NULL,
    `teacherId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeachingEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `semesterPeriodId` INTEGER NOT NULL,
    `ordered` BOOLEAN NOT NULL,
    `hours` INTEGER NOT NULL,
    `programId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeachingGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupName` VARCHAR(191) NOT NULL,
    `groupBalance` DOUBLE NOT NULL,
    `teacherId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProgramToSemesterPeriod` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProgramToSemesterPeriod_AB_unique`(`A`, `B`),
    INDEX `_ProgramToSemesterPeriod_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_semesterPeriodId_fkey` FOREIGN KEY (`semesterPeriodId`) REFERENCES `SemesterPeriod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supervision` ADD CONSTRAINT `Supervision_semesterPeriodId_fkey` FOREIGN KEY (`semesterPeriodId`) REFERENCES `SemesterPeriod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supervision` ADD CONSTRAINT `Supervision_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeachingDutyPerSemester` ADD CONSTRAINT `TeachingDutyPerSemester_semesterPeriodId_fkey` FOREIGN KEY (`semesterPeriodId`) REFERENCES `SemesterPeriod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeachingDutyPerSemester` ADD CONSTRAINT `TeachingDutyPerSemester_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeachingEvent` ADD CONSTRAINT `TeachingEvent_semesterPeriodId_fkey` FOREIGN KEY (`semesterPeriodId`) REFERENCES `SemesterPeriod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeachingEvent` ADD CONSTRAINT `TeachingEvent_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `Program`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeachingGroup` ADD CONSTRAINT `TeachingGroup_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProgramToSemesterPeriod` ADD CONSTRAINT `_ProgramToSemesterPeriod_A_fkey` FOREIGN KEY (`A`) REFERENCES `Program`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProgramToSemesterPeriod` ADD CONSTRAINT `_ProgramToSemesterPeriod_B_fkey` FOREIGN KEY (`B`) REFERENCES `SemesterPeriod`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
