-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "age" TEXT,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "foodOrange" BOOLEAN NOT NULL DEFAULT false,
    "foodApple" BOOLEAN NOT NULL DEFAULT false,
    "foodBanana" BOOLEAN NOT NULL DEFAULT false,
    "foodMelon" BOOLEAN NOT NULL DEFAULT false,
    "foodGrape" BOOLEAN NOT NULL DEFAULT false,
    "datePublish" DATETIME,
    "dateUpdate" DATETIME,
    "postNumber" TEXT,
    "addressCountry" TEXT,
    "addressPref" TEXT,
    "addressCity" TEXT,
    "address1" TEXT,
    "address2" TEXT,
    "textOption1" TEXT,
    "textOption2" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);