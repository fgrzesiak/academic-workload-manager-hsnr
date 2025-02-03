import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Check if the tables are empty
    const semesterPeriodCount = await prisma.semesterPeriod.count();
    const discountTypeCount = await prisma.discountType.count();
    const supervisionTypeCount = await prisma.supervisionType.count();
    const evaluationSettingsCount = await prisma.evaluationSettings.count();

    if (semesterPeriodCount === 0) {
        // Seed SemesterPeriod
        const semesterPeriods = [
            { name: 'WS20/21', active: false },
            { name: 'SS21', active: false },
            { name: 'WS21/22', active: false },
            { name: 'SS22', active: false },
            { name: 'WS22/23', active: false },
            { name: 'SS23', active: false },
            { name: 'WS23/24', active: false },
            { name: 'SS24', active: true },
        ];

        for (const period of semesterPeriods) {
            await prisma.semesterPeriod.create({
                data: period,
            });
        }
    }

    if (discountTypeCount === 0) {
        // Seed DiscountType
        const discountTypes = [
            { discountType: 'Funktion/Aufgabe' },
            { discountType: 'Forschung/Entwicklung' },
            { discountType: 'Gesetzlich' },
        ];

        for (const discountType of discountTypes) {
            await prisma.discountType.create({
                data: discountType,
            });
        }
    }

    if (supervisionTypeCount === 0) {
        // Seed SupervisionType
        const supervisionTypes = [
            { typeOfSupervision: 'Bachelorarbeit', calculationFactor: 0.2, semesterPeriod: 1 },
            { typeOfSupervision: 'Masterarbeit', calculationFactor: 0.2, semesterPeriod: 1 },
            { typeOfSupervision: 'Zweitprüfer', calculationFactor: 0.2, semesterPeriod: 1 },
            { typeOfSupervision: 'Praxissemster', calculationFactor: 0.2, semesterPeriod: 1 },
            { typeOfSupervision: 'Bachelorarbeit (ab SS24)', calculationFactor: 0.3, semesterPeriod: 8 },
            { typeOfSupervision: 'Masterarbeit (ab SS24)', calculationFactor: 0.3, semesterPeriod: 8 },
            { typeOfSupervision: 'Zweitprüfer (ab SS24)', calculationFactor: 0.1, semesterPeriod: 8 },
        ];

        for (const supervisionType of supervisionTypes) {
            await prisma.supervisionType.create({
                data: supervisionType,
            });
        }
    }

    if (evaluationSettingsCount === 0) {
        // Seed EvaluationSettings
        const evaluationSettings = [
            { key: 'saldation_period', value: 6, dataType: 'int' },
            { key: 'factor_upper_limit', value: 2, dataType: 'int' },
            { key: 'factor_lower_limit', value: 2, dataType: 'int' },
            { key: 'max_hours_supervisions', value: 3.0, dataType: 'float' },
        ];

        for (const setting of evaluationSettings) {
            await prisma.evaluationSettings.create({
                data: setting,
            });
        }
    }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })