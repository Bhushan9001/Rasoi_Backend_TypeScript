-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_reicpeId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "reicpeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reicpeId_fkey" FOREIGN KEY ("reicpeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
