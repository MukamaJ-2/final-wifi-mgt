import { executeQuery, testConnection } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const migrations = [
  {
    name: 'create_admins_table',
    query: `
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_admins_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'create_guest_users_table',
    query: `
      CREATE TABLE IF NOT EXISTS guest_users (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_by VARCHAR(36) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE CASCADE,
        INDEX idx_guest_users_username (username),
        INDEX idx_guest_users_created_by (created_by),
        INDEX idx_guest_users_expires_at (expires_at),
        INDEX idx_guest_users_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'create_sessions_table',
    query: `
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        admin_id VARCHAR(36) NOT NULL,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
        INDEX idx_sessions_admin_id (admin_id),
        INDEX idx_sessions_token_hash (token_hash),
        INDEX idx_sessions_expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: 'update_guest_users_table_with_contact_info',
    query: `
      ALTER TABLE guest_users 
      ADD COLUMN full_name VARCHAR(255) NOT NULL DEFAULT '',
      ADD COLUMN email VARCHAR(255) NOT NULL DEFAULT '',
      ADD COLUMN phone_number VARCHAR(20) NOT NULL DEFAULT '',
      ADD INDEX idx_guest_users_email (email),
      ADD INDEX idx_guest_users_phone (phone_number);
    `
  }
];

const runMigrations = async () => {
  console.log('🚀 Starting database migrations...\n');

  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Cannot proceed with migrations - database connection failed');
    process.exit(1);
  }

  // Run each migration
  for (const migration of migrations) {
    console.log(`📝 Running migration: ${migration.name}`);
    
    const result = await executeQuery(migration.query);
    
    if (result.success) {
      console.log(`✅ Migration completed: ${migration.name}\n`);
    } else {
      console.error(`❌ Migration failed: ${migration.name}`);
      console.error(`Error: ${result.error}\n`);
      process.exit(1);
    }
  }

  console.log('🎉 All migrations completed successfully!');
  process.exit(0);
};

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations().catch(error => {
    console.error('Migration process failed:', error);
    process.exit(1);
  });
}

export { runMigrations };