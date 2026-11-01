-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('saved', 'applied', 'replied', 'interview', 'offer', 'rejected', 'withdrawn');

-- CreateTable
CREATE TABLE "application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "jobPostText" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'saved',
    "followUpAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_event" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fromStatus" "ApplicationStatus",
    "toStatus" "ApplicationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "application_userId_status_idx" ON "application"("userId", "status");

-- CreateIndex
CREATE INDEX "application_event_applicationId_createdAt_idx" ON "application_event"("applicationId", "createdAt");

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_event" ADD CONSTRAINT "application_event_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
