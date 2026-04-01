const app = require('./src/app');
const createTables = require('./src/config/migrate');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Initialize database
        await createTables();

        // Start server
        app.listen(PORT, () => {
            console.log('');
            console.log('╔════════════════════════════════════════╗');
            console.log('║   NEXUS FINANCE API - CYBERPUNK 2077   ║');
            console.log('╚════════════════════════════════════════╝');
            console.log('');
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
            console.log(`📡 API: http://localhost:${PORT}/api`);
            console.log(`💾 Database: PostgreSQL`);
            console.log('');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();