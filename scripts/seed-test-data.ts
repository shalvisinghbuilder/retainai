import { PrismaClient } from '@retainai/db';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test data...\n');

  // 1. Create Employees
  console.log('Creating employees...');
  const manager = await prisma.employee.upsert({
    where: { badgeId: 'MGR001' },
    update: { role: 'MANAGER' },
    create: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      badgeId: 'MGR001',
      role: 'MANAGER',
    },
  });

  const admin = await prisma.employee.upsert({
    where: { badgeId: 'ADMIN001' },
    update: { role: 'ADMIN' },
    create: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      badgeId: 'ADMIN001',
      role: 'ADMIN',
    },
  });

  const employees = await Promise.all([
    prisma.employee.upsert({
      where: { badgeId: 'EMP001' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440010',
        badgeId: 'EMP001',
        role: 'ASSOCIATE',
      },
    }),
    prisma.employee.upsert({
      where: { badgeId: 'EMP002' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440011',
        badgeId: 'EMP002',
        role: 'ASSOCIATE',
      },
    }),
    prisma.employee.upsert({
      where: { badgeId: 'EMP003' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440012',
        badgeId: 'EMP003',
        role: 'ASSOCIATE',
      },
    }),
    prisma.employee.upsert({
      where: { badgeId: 'EMP004' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440013',
        badgeId: 'EMP004',
        role: 'ASSOCIATE',
      },
    }),
    prisma.employee.upsert({
      where: { badgeId: 'EMP005' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440014',
        badgeId: 'EMP005',
        role: 'ASSOCIATE',
      },
    }),
  ]);

  console.log(`✅ Created ${employees.length + 2} employees\n`);

  // 2. Create Candidates
  console.log('Creating candidates...');
  const candidate1 = await prisma.candidate.upsert({
    where: { phone: '+15551234567' },
    update: { status: 'VJTPENDING' },
    create: {
      id: '660e8400-e29b-41d4-a716-446655440001',
      phone: '+15551234567',
      name: 'John Doe',
      status: 'VJTPENDING',
    },
  });

  const candidate2 = await prisma.candidate.upsert({
    where: { phone: '+15551234568' },
    update: { status: 'VJTPASSED' },
    create: {
      id: '660e8400-e29b-41d4-a716-446655440002',
      phone: '+15551234568',
      name: 'Jane Smith',
      status: 'VJTPASSED',
    },
  });

  const candidate3 = await prisma.candidate.upsert({
    where: { phone: '+15551234569' },
    update: {
      status: 'VJTFAILED',
      coolDownUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
    create: {
      id: '660e8400-e29b-41d4-a716-446655440003',
      phone: '+15551234569',
      name: 'Bob Johnson',
      status: 'VJTFAILED',
      coolDownUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });

  console.log(`✅ Created 3 candidates\n`);

  // 3. Create Conversation Sessions
  console.log('Creating conversation sessions...');
  await Promise.all([
    prisma.conversationSession.upsert({
      where: { candidateId: candidate1.id },
      update: { currentState: 'VJT_LINK_SENT' },
      create: {
        id: '770e8400-e29b-41d4-a716-446655440001',
        candidateId: candidate1.id,
        currentState: 'VJT_LINK_SENT',
      },
    }),
    prisma.conversationSession.upsert({
      where: { candidateId: candidate2.id },
      update: { currentState: 'VJT_LINK_SENT' },
      create: {
        id: '770e8400-e29b-41d4-a716-446655440002',
        candidateId: candidate2.id,
        currentState: 'VJT_LINK_SENT',
      },
    }),
    prisma.conversationSession.upsert({
      where: { candidateId: candidate3.id },
      update: { currentState: 'VJT_LINK_SENT' },
      create: {
        id: '770e8400-e29b-41d4-a716-446655440003',
        candidateId: candidate3.id,
        currentState: 'VJT_LINK_SENT',
      },
    }),
  ]);

  console.log(`✅ Created 3 conversation sessions\n`);

  // 4. Create Scan Events
  console.log('Creating scan events...');
  const now = new Date();
  const scanEvents = await Promise.all([
    prisma.scanEvent.upsert({
      where: { id: '880e8400-e29b-41d4-a716-446655440001' },
      update: {},
      create: {
        id: '880e8400-e29b-41d4-a716-446655440001',
        employeeId: employees[0].id,
        barcode: 'BC001',
        location: 'Aisle-1-Shelf-2',
        actionType: 'PICK',
        timestamp: new Date(now.getTime() - 1 * 60 * 1000), // 1 min ago
        expectedSeconds: 15.0,
        actualSeconds: 14.5,
        isError: false,
      },
    }),
    prisma.scanEvent.upsert({
      where: { id: '880e8400-e29b-41d4-a716-446655440002' },
      update: {},
      create: {
        id: '880e8400-e29b-41d4-a716-446655440002',
        employeeId: employees[0].id,
        barcode: 'BC002',
        location: 'Aisle-1-Shelf-3',
        actionType: 'STOW',
        timestamp: new Date(now.getTime() - 30 * 1000), // 30 sec ago
        expectedSeconds: 15.0,
        actualSeconds: 15.2,
        isError: false,
      },
    }),
    prisma.scanEvent.upsert({
      where: { id: '880e8400-e29b-41d4-a716-446655440003' },
      update: {},
      create: {
        id: '880e8400-e29b-41d4-a716-446655440003',
        employeeId: employees[1].id,
        barcode: 'BC003',
        location: 'Aisle-2-Shelf-1',
        actionType: 'PICK',
        timestamp: new Date(now.getTime() - 1.5 * 60 * 1000), // 1.5 min ago
        expectedSeconds: 15.0,
        actualSeconds: 14.8,
        isError: false,
      },
    }),
    prisma.scanEvent.upsert({
      where: { id: '880e8400-e29b-41d4-a716-446655440004' },
      update: {},
      create: {
        id: '880e8400-e29b-41d4-a716-446655440004',
        employeeId: employees[2].id,
        barcode: 'BC004',
        location: 'Aisle-3-Shelf-2',
        actionType: 'COUNT',
        timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 min ago
        expectedSeconds: 15.0,
        actualSeconds: 16.0,
        isError: false,
      },
    }),
    prisma.scanEvent.upsert({
      where: { id: '880e8400-e29b-41d4-a716-446655440005' },
      update: {},
      create: {
        id: '880e8400-e29b-41d4-a716-446655440005',
        employeeId: employees[3].id,
        barcode: 'BC005',
        location: 'Aisle-4-Shelf-1',
        actionType: 'STOW',
        timestamp: new Date(now.getTime() - 10 * 60 * 1000), // 10 min ago
        expectedSeconds: 15.0,
        actualSeconds: 14.2,
        isError: false,
      },
    }),
    prisma.scanEvent.upsert({
      where: { id: '880e8400-e29b-41d4-a716-446655440006' },
      update: {},
      create: {
        id: '880e8400-e29b-41d4-a716-446655440006',
        employeeId: employees[4].id,
        barcode: 'BC006',
        location: 'Aisle-5-Shelf-3',
        actionType: 'PICK',
        timestamp: new Date(now.getTime() - 20 * 60 * 1000), // 20 min ago
        expectedSeconds: 15.0,
        actualSeconds: 15.5,
        isError: false,
      },
    }),
  ]);

  console.log(`✅ Created ${scanEvents.length} scan events\n`);

  // 5. Create ADAPT Records
  console.log('Creating ADAPT records...');
  const adaptRecords = await Promise.all([
    prisma.adaptRecord.upsert({
      where: { id: '990e8400-e29b-41d4-a716-446655440001' },
      update: {},
      create: {
        id: '990e8400-e29b-41d4-a716-446655440001',
        employeeId: employees[0].id,
        type: 'PRODUCTIVITY',
        status: 'PENDINGREVIEW',
        metricValue: 42.0,
        metricThreshold: 55.0,
        generatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
    }),
    prisma.adaptRecord.upsert({
      where: { id: '990e8400-e29b-41d4-a716-446655440002' },
      update: {},
      create: {
        id: '990e8400-e29b-41d4-a716-446655440002',
        employeeId: employees[1].id,
        type: 'PRODUCTIVITY',
        status: 'PENDINGREVIEW',
        metricValue: 38.0,
        metricThreshold: 55.0,
        generatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    }),
  ]);

  console.log(`✅ Created ${adaptRecords.length} ADAPT records\n`);

  // 6. Create Sentiment Responses
  console.log('Creating sentiment responses...');
  const sentiments = await Promise.all([
    prisma.sentimentResponse.upsert({
      where: { id: 'aa0e8400-e29b-41d4-a716-446655440001' },
      update: {},
      create: {
        id: 'aa0e8400-e29b-41d4-a716-446655440001',
        employeeId: employees[0].id,
        questionId: 'daily_tools_question',
        score: 4,
        respondedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    }),
    prisma.sentimentResponse.upsert({
      where: { id: 'aa0e8400-e29b-41d4-a716-446655440002' },
      update: {},
      create: {
        id: 'aa0e8400-e29b-41d4-a716-446655440002',
        employeeId: employees[1].id,
        questionId: 'daily_tools_question',
        score: 5,
        respondedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
    }),
  ]);

  console.log(`✅ Created ${sentiments.length} sentiment responses\n`);

  console.log('✅ Test data seeding complete!\n');
  console.log('📊 Summary:');
  console.log(`   - Employees: ${employees.length + 2} (1 Manager, 1 Admin, ${employees.length} Associates)`);
  console.log(`   - Candidates: 3`);
  console.log(`   - Scan Events: ${scanEvents.length}`);
  console.log(`   - ADAPT Records: ${adaptRecords.length}`);
  console.log(`   - Sentiment Responses: ${sentiments.length}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

