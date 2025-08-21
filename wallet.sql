INSERT INTO wallets (id, "userId", balance, locked, "createdAt", "updatedAt") 
VALUES ('wallet-test-123', 'test-user-123', 100, 0, NOW(), NOW()) 
ON CONFLICT DO NOTHING;
