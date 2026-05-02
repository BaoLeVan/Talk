-- Seed data for PostgreSQL entities in TalkTalk
-- Covers: permissions, roles, role_permissions, users, user_roles,
-- conversations, conversations_members.
--
-- Notes:
-- 1) Roles are intentionally limited to USER and ADMIN because role_name is the PK
--    and the application enum only defines those two values.
-- 2) The same BCrypt hash is reused for all seeded users. Replace it if you want a
--    different known password for local login.
-- 3) This script is idempotent for the seeded keys and resets sequences afterward.

BEGIN;

INSERT INTO permissions (permission_name, description)
SELECT
    format('CHAT_PERMISSION_%s', lpad(gs::text, 2, '0')),
    format('Seed permission number %s', gs)
FROM generate_series(1, 50) AS gs
ON CONFLICT (permission_name) DO NOTHING;

INSERT INTO roles (role_name, description)
VALUES
    ('USER', 'Default application user role'),
    ('ADMIN', 'Administrator role with full seeded access')
ON CONFLICT (role_name) DO NOTHING;

INSERT INTO role_permissions (role_name, permission_name)
SELECT 'ADMIN', p.permission_name
FROM permissions p
WHERE p.permission_name LIKE 'CHAT_PERMISSION_%'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_name, permission_name)
SELECT
    'USER',
    format('CHAT_PERMISSION_%s', lpad(gs::text, 2, '0'))
FROM generate_series(1, 25) AS gs
ON CONFLICT DO NOTHING;

INSERT INTO users (
    usr_id,
    usr_avatar,
    usr_user_name,
    usr_email,
    usr_password,
    is_verified,
    deleted_at,
    created_at,
    updated_at
)
SELECT
    gs,
    format('https://i.pravatar.cc/150?img=%s', ((gs - 1) % 70) + 1),
    format('user_%s', lpad(gs::text, 2, '0')),
    format('user_%s@talk.local', lpad(gs::text, 2, '0')),
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOHiW3iA4lFJd4SLd0t7E/5uWQ9Y8KqW6',
    TRUE,
    NULL,
    NOW() - make_interval(days => 60 - gs),
    NOW() - make_interval(days => 60 - gs)
FROM generate_series(1, 50) AS gs
ON CONFLICT (usr_id) DO NOTHING;

INSERT INTO user_roles (usr_id, role_name)
SELECT
    gs,
    CASE WHEN gs <= 5 THEN 'ADMIN' ELSE 'USER' END
FROM generate_series(1, 50) AS gs
ON CONFLICT DO NOTHING;

INSERT INTO conversations (
    cvs_id,
    cvs_avatar,
    cvs_title,
    cvs_type,
    last_message,
    last_message_at,
    deleted_at,
    created_at,
    updated_at
)
SELECT
    gs,
    CASE
        WHEN gs % 3 = 0 THEN format('https://picsum.photos/seed/conversation-%s/200/200', gs)
        ELSE NULL
    END,
    CASE
        WHEN gs % 3 = 0 THEN format('Project Group %s', lpad(gs::text, 2, '0'))
        ELSE format('Private Chat %s', lpad(gs::text, 2, '0'))
    END,
    CASE
        WHEN gs % 3 = 0 THEN 1
        ELSE 0
    END,
    format('Seed last message for conversation %s', gs),
    NOW() - make_interval(hours => gs),
    NULL,
    NOW() - make_interval(days => gs),
    NOW() - make_interval(hours => gs)
FROM generate_series(1, 50) AS gs
ON CONFLICT (cvs_id) DO NOTHING;

WITH creator_members AS (
    SELECT
        (2 * gs) - 1 AS cvs_mem_id,
        gs AS cvs_id,
        ((gs - 1) % 50) + 1 AS usr_id,
        'ADMIN'::varchar AS role,
        (NOW() - make_interval(days => gs)) AS joined_at,
        NULL::timestamp AS left_at,
        NULL::bigint AS last_read_msg_id,
        (NOW() - make_interval(days => gs)) AS created_at,
        (NOW() - make_interval(hours => gs)) AS updated_at
    FROM generate_series(1, 50) AS gs
),
second_members AS (
    SELECT
        (2 * gs) AS cvs_mem_id,
        gs AS cvs_id,
        ((gs + 18) % 50) + 1 AS usr_id,
        'MEMBER'::varchar AS role,
        (NOW() - make_interval(days => gs - 1)) AS joined_at,
        NULL::timestamp AS left_at,
        NULL::bigint AS last_read_msg_id,
        (NOW() - make_interval(days => gs - 1)) AS created_at,
        (NOW() - make_interval(hours => gs)) AS updated_at
    FROM generate_series(1, 50) AS gs
),
third_group_members AS (
    SELECT
        100 + gs AS cvs_mem_id,
        gs AS cvs_id,
        ((gs + 31) % 50) + 1 AS usr_id,
        'MEMBER'::varchar AS role,
        (NOW() - make_interval(days => gs - 2)) AS joined_at,
        NULL::timestamp AS left_at,
        NULL::bigint AS last_read_msg_id,
        (NOW() - make_interval(days => gs - 2)) AS created_at,
        (NOW() - make_interval(hours => gs)) AS updated_at
    FROM generate_series(1, 50) AS gs
    WHERE gs % 3 = 0
)
INSERT INTO conversations_members (
    cvs_mem_id,
    role,
    last_read_msg_id,
    joined_at,
    left_at,
    cvs_id,
    usr_id,
    created_at,
    updated_at
)
SELECT cvs_mem_id, role, last_read_msg_id, joined_at, left_at, cvs_id, usr_id, created_at, updated_at
FROM creator_members
UNION ALL
SELECT cvs_mem_id, role, last_read_msg_id, joined_at, left_at, cvs_id, usr_id, created_at, updated_at
FROM second_members
UNION ALL
SELECT cvs_mem_id, role, last_read_msg_id, joined_at, left_at, cvs_id, usr_id, created_at, updated_at
FROM third_group_members
ON CONFLICT (cvs_mem_id) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('users', 'usr_id'),
    COALESCE((SELECT MAX(usr_id) FROM users), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('conversations', 'cvs_id'),
    COALESCE((SELECT MAX(cvs_id) FROM conversations), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('conversations_members', 'cvs_mem_id'),
    COALESCE((SELECT MAX(cvs_mem_id) FROM conversations_members), 1),
    true
);

COMMIT;
