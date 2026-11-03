-- CreateEnum
CREATE TYPE "AiJobType" AS ENUM ('fake');

-- CreateEnum
CREATE TYPE "AiJobStatus" AS ENUM ('queued', 'running', 'completed', 'failed');

-- CreateTable
CREATE TABLE "ai_job" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AiJobType" NOT NULL,
    "status" "AiJobStatus" NOT NULL DEFAULT 'queued',
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "ai_job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_job_userId_createdAt_idx" ON "ai_job"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "ai_job" ADD CONSTRAINT "ai_job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
