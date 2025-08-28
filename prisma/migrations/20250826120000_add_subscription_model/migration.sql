-- CreateIndex
CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Subscription_status_idx" ON "Subscription"("status");

-- AddForeignKey
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'Subscription_userId_fkey'
  ) THEN
    ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;