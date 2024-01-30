-- CreateTable
CREATE TABLE "FollowingItem" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowingItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FollowingItemToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FollowingItem_itemId_key" ON "FollowingItem"("itemId");

-- CreateIndex
CREATE INDEX "FollowingItem_itemId_idx" ON "FollowingItem"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "_FollowingItemToUser_AB_unique" ON "_FollowingItemToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FollowingItemToUser_B_index" ON "_FollowingItemToUser"("B");

-- CreateIndex
CREATE INDEX "users_user_id_idx" ON "users"("user_id");

-- AddForeignKey
ALTER TABLE "_FollowingItemToUser" ADD CONSTRAINT "_FollowingItemToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "FollowingItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FollowingItemToUser" ADD CONSTRAINT "_FollowingItemToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
