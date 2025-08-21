INSERT INTO wallets (id, "userId", balance, locked, "createdAt", "updatedAt") 
SELECT 'wallet-' || id, id, 100, 0, NOW(), NOW() 
FROM users WHERE email = 'test@example.com' 
ON CONFLICT DO NOTHING;
