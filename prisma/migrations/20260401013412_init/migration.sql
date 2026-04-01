-- CreateEnum
CREATE TYPE "MembershipTier" AS ENUM ('INDIVIDUAL', 'INSTITUTIONAL', 'CORPORATE');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "githubHandle" TEXT NOT NULL,
    "affiliation" TEXT,
    "oflaAgreed" BOOLEAN NOT NULL DEFAULT false,
    "oflaAgreedAt" TIMESTAMP(3),
    "tier" "MembershipTier" NOT NULL DEFAULT 'INDIVIDUAL',
    "votingWeight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_githubHandle_key" ON "User"("githubHandle");
