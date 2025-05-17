-- This is an empty migration.

-- CreateDefaultAdmin
DELETE FROM "User" WHERE id = 'admin-default';

INSERT INTO "User" ("id", "username", "email", "password", "role", "createdAt", "updatedAt")
VALUES (
  'admin-default',
  'admin',
  'admin@example.com',
  '$2b$10$/UExlkl6i1KkgxamvoF42.sWohkxNI66xNeRIEQIKlS5VBeCHVDGq', -- senha: admin123
  'ADMIN',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;