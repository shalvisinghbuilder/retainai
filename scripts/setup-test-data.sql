-- RetainAI MVP Test Data Setup
-- Run this script to populate the database with test data

-- Clear existing test data (optional - comment out if you want to keep existing data)
-- DELETE FROM scanevents WHERE employeeid IN (SELECT id FROM employees WHERE badgeid LIKE 'TEST%' OR badgeid LIKE 'MGR%' OR badgeid LIKE 'ADMIN%');
-- DELETE FROM sentimentresponses WHERE employeeid IN (SELECT id FROM employees WHERE badgeid LIKE 'TEST%' OR badgeid LIKE 'MGR%' OR badgeid LIKE 'ADMIN%');
-- DELETE FROM adaptrecords WHERE employeeid IN (SELECT id FROM employees WHERE badgeid LIKE 'TEST%' OR badgeid LIKE 'MGR%' OR badgeid LIKE 'ADMIN%');
-- DELETE FROM employees WHERE badgeid LIKE 'TEST%' OR badgeid LIKE 'MGR%' OR badgeid LIKE 'ADMIN%';
-- DELETE FROM candidates WHERE phone LIKE '+1555%';

-- ============================================
-- 1. CREATE TEST EMPLOYEES
-- ============================================

-- Manager (for Dashboard testing)
INSERT INTO employees (id, badgeid, role, "createdAt", "updatedAt")
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'MGR001', 'MANAGER', NOW(), NOW())
ON CONFLICT (badgeid) DO UPDATE SET role = EXCLUDED.role;

-- Admin (for Dashboard testing)
INSERT INTO employees (id, badgeid, role, "createdAt", "updatedAt")
VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', 'ADMIN001', 'ADMIN', NOW(), NOW())
ON CONFLICT (badgeid) DO UPDATE SET role = EXCLUDED.role;

-- Associates (for Scanner app testing)
INSERT INTO employees (id, badgeid, role, "createdAt", "updatedAt")
VALUES 
  ('550e8400-e29b-41d4-a716-446655440010', 'EMP001', 'ASSOCIATE', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440011', 'EMP002', 'ASSOCIATE', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440012', 'EMP003', 'ASSOCIATE', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440013', 'EMP004', 'ASSOCIATE', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440014', 'EMP005', 'ASSOCIATE', NOW(), NOW())
ON CONFLICT (badgeid) DO UPDATE SET role = EXCLUDED.role;

-- ============================================
-- 2. CREATE TEST CANDIDATES (for VJT testing)
-- ============================================

-- Candidate 1: Ready for VJT
INSERT INTO candidates (id, phone, name, status, "createdAt", "updatedAt")
VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', '+15551234567', 'John Doe', 'VJTPENDING', NOW(), NOW())
ON CONFLICT (phone) DO UPDATE SET status = EXCLUDED.status;

-- Candidate 2: Passed VJT
INSERT INTO candidates (id, phone, name, status, "createdAt", "updatedAt")
VALUES 
  ('660e8400-e29b-41d4-a716-446655440002', '+15551234568', 'Jane Smith', 'VJTPASSED', NOW(), NOW())
ON CONFLICT (phone) DO UPDATE SET status = EXCLUDED.status;

-- Candidate 3: Failed VJT (in cooldown)
INSERT INTO candidates (id, phone, name, status, "cooldownuntil", "createdAt", "updatedAt")
VALUES 
  ('660e8400-e29b-41d4-a716-446655440003', '+15551234569', 'Bob Johnson', 'VJTFAILED', NOW() + INTERVAL '90 days', NOW(), NOW())
ON CONFLICT (phone) DO UPDATE SET status = EXCLUDED.status, "cooldownuntil" = EXCLUDED."cooldownuntil";

-- ============================================
-- 3. CREATE CONVERSATION SESSIONS
-- ============================================

INSERT INTO conversationsessions (id, candidateid, currentstate, "createdAt", "updatedAt")
VALUES 
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'VJT_LINK_SENT', NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'VJT_LINK_SENT', NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'VJT_LINK_SENT', NOW(), NOW())
ON CONFLICT (candidateid) DO UPDATE SET currentstate = EXCLUDED.currentstate;

-- ============================================
-- 4. CREATE SCAN EVENTS (for Map visualization)
-- ============================================

-- Recent scans (active workers - < 2 minutes)
INSERT INTO scanevents (id, employeeid, barcode, location, "actionType", timestamp, expectedseconds, actualseconds, "isError", "syncedAt")
VALUES 
  -- EMP001: Active (1 minute ago)
  ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'BC001', 'Aisle-1-Shelf-2', 'PICK', NOW() - INTERVAL '1 minute', 15.0, 14.5, false, NOW()),
  ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 'BC002', 'Aisle-1-Shelf-3', 'STOW', NOW() - INTERVAL '30 seconds', 15.0, 15.2, false, NOW()),
  
  -- EMP002: Active (1.5 minutes ago)
  ('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440011', 'BC003', 'Aisle-2-Shelf-1', 'PICK', NOW() - INTERVAL '1 minute 30 seconds', 15.0, 14.8, false, NOW()),
  
  -- EMP003: Idle (5 minutes ago)
  ('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440012', 'BC004', 'Aisle-3-Shelf-2', 'COUNT', NOW() - INTERVAL '5 minutes', 15.0, 16.0, false, NOW()),
  
  -- EMP004: Idle (10 minutes ago)
  ('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440013', 'BC005', 'Aisle-4-Shelf-1', 'STOW', NOW() - INTERVAL '10 minutes', 15.0, 14.2, false, NOW()),
  
  -- EMP005: Offline (20 minutes ago)
  ('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440014', 'BC006', 'Aisle-5-Shelf-3', 'PICK', NOW() - INTERVAL '20 minutes', 15.0, 15.5, false, NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. CREATE ADAPT RECORDS (for Queue testing)
-- ============================================

-- Pending AdaptRecord for EMP001 (low productivity)
INSERT INTO adaptrecords (id, employeeid, type, status, metricvalue, metricthreshold, "generatedAt", "deliveredAt")
VALUES 
  ('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'PRODUCTIVITY', 'PENDINGREVIEW', 42.0, 55.0, NOW() - INTERVAL '1 hour', NULL),
  ('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011', 'PRODUCTIVITY', 'PENDINGREVIEW', 38.0, 55.0, NOW() - INTERVAL '2 hours', NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. CREATE SENTIMENT RESPONSES (optional)
-- ============================================

-- Today's sentiment for EMP001
INSERT INTO sentimentresponses (id, employeeid, questionid, score, "respondedAt")
VALUES 
  ('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'daily_tools_question', 4, NOW() - INTERVAL '2 hours'),
  ('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011', 'daily_tools_question', 5, NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check employees
SELECT 'Employees' as type, COUNT(*) as count FROM employees WHERE badgeid LIKE 'MGR%' OR badgeid LIKE 'ADMIN%' OR badgeid LIKE 'EMP%'
UNION ALL
-- Check candidates
SELECT 'Candidates' as type, COUNT(*) as count FROM candidates WHERE phone LIKE '+1555%'
UNION ALL
-- Check scan events
SELECT 'Scan Events' as type, COUNT(*) as count FROM scanevents WHERE employeeid IN (SELECT id FROM employees WHERE badgeid LIKE 'EMP%')
UNION ALL
-- Check adapt records
SELECT 'Adapt Records' as type, COUNT(*) as count FROM adaptrecords WHERE status = 'PENDINGREVIEW';

