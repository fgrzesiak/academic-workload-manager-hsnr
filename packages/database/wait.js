const seconds = process.argv[2] || 5; // Zeit in Sekunden, standardmäßig 5 Sekunden
setTimeout(() => process.exit(0), seconds * 1000);
