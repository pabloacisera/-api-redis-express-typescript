-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "properties" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "file_number" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "address" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "dateRegitried" DATETIME NOT NULL,
    CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "owners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "cuit" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "nationality" TEXT NOT NULL DEFAULT 'Argentina',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "properties_file_number_key" ON "properties"("file_number");

-- CreateIndex
CREATE UNIQUE INDEX "owners_dni_key" ON "owners"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "owners_cuit_key" ON "owners"("cuit");

-- CreateIndex
CREATE UNIQUE INDEX "owners_email_key" ON "owners"("email");
