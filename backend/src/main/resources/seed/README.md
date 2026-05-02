# Seed data usage

Files in this folder:

- `postgres_seed.sql` for PostgreSQL entities
- `mongo_seed.js` for MongoDB documents

## PostgreSQL

Run with `psql`:

```powershell
psql -U postgres -d talktalk -f src/main/resources/seed/postgres_seed.sql
```

This script seeds:

- 50 permissions
- 2 roles (`USER`, `ADMIN`)
- 75 role-permission mappings
- 50 users
- 50 user-role mappings
- 50 conversations
- 116 conversation-member rows

> Roles are only 2 records because the app enum and primary key only support `USER` and `ADMIN`.

## MongoDB

Run with `mongosh`:

```powershell
mongosh "mongodb://localhost:27017/talktalk" --file src/main/resources/seed/mongo_seed.js
```

If you want to seed your Atlas cluster instead, replace the Mongo connection string above with your Atlas URI.

This script seeds:

- 50 attachments
- 50 messages

## Seeded user password

The SQL script reuses one BCrypt hash for all users. If you need known login credentials, replace the hash in `postgres_seed.sql` with a BCrypt hash generated from your preferred plaintext password.
