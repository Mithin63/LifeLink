import { seedDatabase } from './seedData.js';
async function main() {
    try {
        await seedDatabase();
        process.exit(0);
    }
    catch (err) {
        console.error('Seed runner failed:', err);
        process.exit(1);
    }
}
main();
