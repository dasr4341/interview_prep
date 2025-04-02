/*
  Warnings:

  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'DEALER', 'USER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "Roles" NOT NULL;
