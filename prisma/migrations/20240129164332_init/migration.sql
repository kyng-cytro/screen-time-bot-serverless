/*
  Warnings:

  - You are about to drop the column `custom_password` on the `screen_time_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `custom_username` on the `screen_time_accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "screen_time_accounts" DROP COLUMN "custom_password",
DROP COLUMN "custom_username";
