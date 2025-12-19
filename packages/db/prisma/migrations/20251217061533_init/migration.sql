-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CANDIDATE', 'ASSOCIATE', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('NEW', 'SCREENING', 'VJTPENDING', 'VJTPASSED', 'VJTFAILED', 'HIRED', 'REJECTEDCOOLDOWN');

-- CreateEnum
CREATE TYPE "ScanType" AS ENUM ('PICK', 'STOW', 'COUNT', 'ERRORLOG');

-- CreateEnum
CREATE TYPE "AdaptType" AS ENUM ('PRODUCTIVITY', 'QUALITY', 'ATTENDANCE');

-- CreateEnum
CREATE TYPE "AdaptStatus" AS ENUM ('PENDINGREVIEW', 'APPROVEDDELIVERED', 'EXEMPTED');

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "status" "CandidateStatus" NOT NULL DEFAULT 'NEW',
    "sourcecode" TEXT,
    "cooldownuntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversationsessions" (
    "id" TEXT NOT NULL,
    "candidateid" TEXT NOT NULL,
    "currentstate" TEXT NOT NULL,

    CONSTRAINT "conversationsessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messagelogs" (
    "id" TEXT NOT NULL,
    "sessionid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messagelogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessmentresults" (
    "id" TEXT NOT NULL,
    "candidateid" TEXT NOT NULL,
    "skillScore" DOUBLE PRECISION NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessmentresults_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hiringevents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hiringevents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventregistrations" (
    "id" TEXT NOT NULL,
    "eventid" TEXT NOT NULL,
    "candidateid" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "eventregistrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "badgeid" TEXT NOT NULL,
    "candidateid" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ASSOCIATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scanevents" (
    "id" TEXT NOT NULL,
    "employeeid" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "actionType" "ScanType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "expectedseconds" DOUBLE PRECISION NOT NULL,
    "actualseconds" DOUBLE PRECISION,
    "isError" BOOLEAN NOT NULL DEFAULT false,
    "errorcode" TEXT,
    "syncedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scanevents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adaptrecords" (
    "id" TEXT NOT NULL,
    "employeeid" TEXT NOT NULL,
    "type" "AdaptType" NOT NULL,
    "status" "AdaptStatus" NOT NULL DEFAULT 'PENDINGREVIEW',
    "metricvalue" DOUBLE PRECISION NOT NULL,
    "metricthreshold" DOUBLE PRECISION NOT NULL,
    "generatedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredat" TIMESTAMP(3),

    CONSTRAINT "adaptrecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sentimentresponses" (
    "id" TEXT NOT NULL,
    "employeeid" TEXT NOT NULL,
    "questionid" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "respondedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sentimentresponses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidates_phone_key" ON "candidates"("phone");

-- CreateIndex
CREATE INDEX "candidates_status_idx" ON "candidates"("status");

-- CreateIndex
CREATE INDEX "candidates_phone_idx" ON "candidates"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "conversationsessions_candidateid_key" ON "conversationsessions"("candidateid");

-- CreateIndex
CREATE INDEX "messagelogs_sessionid_timestamp_idx" ON "messagelogs"("sessionid", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "assessmentresults_candidateid_key" ON "assessmentresults"("candidateid");

-- CreateIndex
CREATE UNIQUE INDEX "eventregistrations_eventid_candidateid_key" ON "eventregistrations"("eventid", "candidateid");

-- CreateIndex
CREATE UNIQUE INDEX "employees_badgeid_key" ON "employees"("badgeid");

-- CreateIndex
CREATE UNIQUE INDEX "employees_candidateid_key" ON "employees"("candidateid");

-- CreateIndex
CREATE INDEX "employees_badgeid_idx" ON "employees"("badgeid");

-- CreateIndex
CREATE INDEX "scanevents_employeeid_timestamp_idx" ON "scanevents"("employeeid", "timestamp");

-- CreateIndex
CREATE INDEX "scanevents_timestamp_idx" ON "scanevents"("timestamp");

-- CreateIndex
CREATE INDEX "adaptrecords_employeeid_status_idx" ON "adaptrecords"("employeeid", "status");

-- CreateIndex
CREATE INDEX "sentimentresponses_employeeid_respondedat_idx" ON "sentimentresponses"("employeeid", "respondedat");

-- AddForeignKey
ALTER TABLE "conversationsessions" ADD CONSTRAINT "conversationsessions_candidateid_fkey" FOREIGN KEY ("candidateid") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messagelogs" ADD CONSTRAINT "messagelogs_sessionid_fkey" FOREIGN KEY ("sessionid") REFERENCES "conversationsessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessmentresults" ADD CONSTRAINT "assessmentresults_candidateid_fkey" FOREIGN KEY ("candidateid") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventregistrations" ADD CONSTRAINT "eventregistrations_eventid_fkey" FOREIGN KEY ("eventid") REFERENCES "hiringevents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventregistrations" ADD CONSTRAINT "eventregistrations_candidateid_fkey" FOREIGN KEY ("candidateid") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_candidateid_fkey" FOREIGN KEY ("candidateid") REFERENCES "candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scanevents" ADD CONSTRAINT "scanevents_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptrecords" ADD CONSTRAINT "adaptrecords_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentimentresponses" ADD CONSTRAINT "sentimentresponses_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
