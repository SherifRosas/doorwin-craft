-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Org" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Org_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "trialEndsAt" DATETIME,
    "currentPeriodEnd" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "orgId" TEXT NOT NULL,
    CONSTRAINT "Subscription_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "gateway" TEXT NOT NULL,
    "gatewayId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "orgId" TEXT NOT NULL,
    CONSTRAINT "Payment_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "orgId" TEXT NOT NULL,
    CONSTRAINT "Customer_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Design" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "config" TEXT NOT NULL,
    "price" INTEGER,
    "thumbnail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "orgId" TEXT NOT NULL,
    CONSTRAINT "Design_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "subtotal" INTEGER NOT NULL,
    "vat" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "orgId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    CONSTRAINT "Order_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" INTEGER NOT NULL,
    "notes" TEXT,
    "orderId" TEXT NOT NULL,
    "designId" TEXT,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_orgId_key" ON "Subscription"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
