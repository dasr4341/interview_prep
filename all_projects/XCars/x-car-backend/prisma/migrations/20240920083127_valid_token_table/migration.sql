-- CreateTable
CREATE TABLE "valid_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "valid_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "valid_tokens_token_key" ON "valid_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "valid_tokens_user_id_key" ON "valid_tokens"("user_id");
