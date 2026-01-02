/**
 * Script to add a new Editor user or upgrade existing user to Editor
 * 
 * Usage:
 *   node scripts/add-editor.js <email> [name] [password]
 * 
 * Examples:
 *   node scripts/add-editor.js editor2@example.com "Editor 2" "SecurePass123!"
 *   node scripts/add-editor.js existing@example.com  (upgrades existing user)
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function addEditor(email, name, password) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      // Upgrade existing user to EDITOR
      if (existingUser.role === 'EDITOR') {
        console.log(`✅ User ${email} is already an EDITOR`);
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { email: email.toLowerCase() },
        data: { role: 'EDITOR' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      console.log(`✅ Upgraded user to EDITOR:`);
      console.log(`   Email: ${updatedUser.email}`);
      console.log(`   Name: ${updatedUser.name}`);
      console.log(`   Role: ${updatedUser.role}`);
      return;
    }

    // Create new user
    if (!name || !password) {
      console.error('❌ Error: Name and password are required for new users');
      console.log('\nUsage: node scripts/add-editor.js <email> <name> <password>');
      process.exit(1);
    }

    // Validate password
    if (password.length < 8) {
      console.error('❌ Error: Password must be at least 8 characters');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: 'EDITOR',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    console.log(`✅ Created new EDITOR user:`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Name: ${newUser.name}`);
    console.log(`   Role: ${newUser.role}`);
    console.log(`   Created: ${newUser.createdAt}`);
    console.log(`\n📧 Login credentials:`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Password: ${password}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('📝 Add Editor User Script');
  console.log('\nUsage:');
  console.log('  node scripts/add-editor.js <email> [name] [password]');
  console.log('\nExamples:');
  console.log('  # Upgrade existing user to Editor:');
  console.log('  node scripts/add-editor.js existing@example.com');
  console.log('\n  # Create new Editor user:');
  console.log('  node scripts/add-editor.js editor2@example.com "Editor 2" "SecurePass123!"');
  process.exit(1);
}

const [email, name, password] = args;

if (!email) {
  console.error('❌ Error: Email is required');
  process.exit(1);
}

addEditor(email, name, password);

