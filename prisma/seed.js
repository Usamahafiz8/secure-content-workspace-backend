const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password function
  const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
  };

  // Create Admin user
  const adminPassword = await hashPassword('Admin123!');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Created Admin user:', admin.email);

  // Create Editor user
  const editorPassword = await hashPassword('Editor123!');
  const editor = await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: {
      email: 'editor@example.com',
      password: editorPassword,
      name: 'Editor User',
      role: 'EDITOR',
    },
  });
  console.log('✅ Created Editor user:', editor.email);

  // Create Viewer user
  const viewerPassword = await hashPassword('Viewer123!');
  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@example.com' },
    update: {},
    create: {
      email: 'viewer@example.com',
      password: viewerPassword,
      name: 'Viewer User',
      role: 'VIEWER',
    },
  });
  console.log('✅ Created Viewer user:', viewer.email);

  // Create sample articles (only if they don't exist)
  const existingArticles = await prisma.article.count();
  
  if (existingArticles === 0) {
    const sampleArticles = [
      {
        title: 'Welcome to Content Workspace',
        content: '<p>This is a sample published article. It demonstrates the content management system capabilities.</p><p>You can create, edit, and manage articles based on your role permissions.</p>',
        status: 'PUBLISHED',
        authorId: admin.id,
      },
      {
        title: 'Getting Started Guide',
        content: '<p>This guide will help you get started with the Content Workspace platform.</p><h2>Features</h2><ul><li>Role-based access control</li><li>Rich text editing</li><li>Article management</li></ul>',
        status: 'PUBLISHED',
        authorId: editor.id,
      },
      {
        title: 'Draft Article Example',
        content: '<p>This is a draft article that is not yet published. Only the author and admins can see this.</p>',
        status: 'DRAFT',
        authorId: editor.id,
      },
    ];

    for (const article of sampleArticles) {
      const created = await prisma.article.create({
        data: article,
      });
      console.log('✅ Created article:', created.title);
    }
  } else {
    console.log('ℹ️  Articles already exist, skipping article creation');
  }

  console.log('\n🎉 Seeding completed!');
  console.log('\n📋 Test Accounts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:');
  console.log('  Email: admin@example.com');
  console.log('  Password: Admin123!');
  console.log('  Role: ADMIN (Full access)');
  console.log('\nEditor:');
  console.log('  Email: editor@example.com');
  console.log('  Password: Editor123!');
  console.log('  Role: EDITOR (Create & edit own articles)');
  console.log('\nViewer:');
  console.log('  Email: viewer@example.com');
  console.log('  Password: Viewer123!');
  console.log('  Role: VIEWER (Read-only access)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
