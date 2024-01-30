/*
  Warnings:

  - Made the column `k_value` on table `screen_time_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `account_id` on table `screen_time_accounts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "screen_time_accounts" ALTER COLUMN "k_value" SET NOT NULL,
ALTER COLUMN "account_id" SET NOT NULL;
