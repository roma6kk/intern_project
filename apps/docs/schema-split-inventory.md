# Schema Split Inventory

Target schemas in a single PostgreSQL database:

- `auth`: identity tables used for authentication methods.
- `main`: core domain tables.
- `notifications`: notification delivery tables.

## Table Ownership

### auth
- `users`
- `accounts`

### main
- `profiles`
- `follows`
- `posts`
- `assets`
- `comments`
- `likes`
- `chats`
- `chat_participants`
- `messages`
- `reports`
- `user_warnings`
- `user_sanctions`
- `moderation_logs`

### notifications
- `notifications`

## Cross-schema relations (expected)
- `main.profiles.user_id` -> `auth.users.id`
- `main.follows.follower_id` -> `auth.users.id`
- `main.follows.following_id` -> `auth.users.id`
- `main.posts.author_id` -> `auth.users.id`
- `main.comments.author_id` -> `auth.users.id`
- `main.likes.author_id` -> `auth.users.id`
- `main.chat_participants.user_id` -> `auth.users.id`
- `main.messages.sender_id` -> `auth.users.id`
- `main.reports.reporter_id` -> `auth.users.id`
- `main.reports.resolved_by_id` -> `auth.users.id`
- `main.reports.assigned_moderator_id` -> `auth.users.id`
- `main.user_warnings.user_id` -> `auth.users.id`
- `main.user_warnings.actor_id` -> `auth.users.id`
- `main.user_sanctions.user_id` -> `auth.users.id`
- `main.user_sanctions.actor_id` -> `auth.users.id`
- `main.moderation_logs.actor_id` -> `auth.users.id`
- `main.moderation_logs.target_user_id` -> `auth.users.id`
- `notifications.notifications.recipient_id` -> `auth.users.id`
- `notifications.notifications.actor_id` -> `auth.users.id`
