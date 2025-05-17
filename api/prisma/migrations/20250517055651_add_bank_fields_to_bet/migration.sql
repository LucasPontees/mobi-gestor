/*
  Warnings:

  - Added the required column `bankBeforeBet` to the `Bet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "bankAfterBet" DOUBLE PRECISION,
ADD COLUMN     "bankBeforeBet" DOUBLE PRECISION NOT NULL;
