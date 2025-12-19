import pool from './config/database.js';

async function migrate() {
    try {
        console.log('Starting migration...');

        // 1. Update ENUM for ai_verdict to include 'non pertinent'
        console.log('Updating ai_verdict ENUM...');
        await pool.query(`
            ALTER TABLE content_analysis 
            MODIFY COLUMN ai_verdict ENUM('fiable', 'douteux', 'faux', 'non pertinent') DEFAULT 'douteux'
        `);
        console.log('ENUM updated successfully.');

        console.log('Migration completed!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
