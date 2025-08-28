-- CreateTable
CREATE TABLE "TradingSignal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entry" TEXT NOT NULL,
    "takeProfit" TEXT NOT NULL,
    "stopLoss" TEXT NOT NULL,
    "confidence" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TradingSignal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TradingSignal_createdAt_idx" ON "TradingSignal"("createdAt");

-- CreateIndex
CREATE INDEX "TradingSignal_userId_idx" ON "TradingSignal"("userId");

-- AddForeignKey
ALTER TABLE "TradingSignal" ADD CONSTRAINT "TradingSignal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
