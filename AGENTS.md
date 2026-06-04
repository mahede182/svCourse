# Offline-First Course App — Agent Context

> Expo Router (React Native) · Realm DB · RTK Query · Supabase

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

---

## Product Goal

A mobile app where users browse, enroll in, and study courses **entirely offline**. Background sync with Supabase happens transparently when connectivity is available.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Expo Router (SDK 54) |
| Local DB | Realm (`@realm/react`) |
| Remote DB / Auth | Supabase |
| Network sync | RTK Query (`@reduxjs/toolkit`) |
| Lists | `@shopify/flash-list` |
| Animations | `react-native-reanimated` |

---

## Rules (Non-Negotiable)

1. **Realm is the sole source of truth for UI.** Screens read from Realm hooks (`useQuery`, `useObject`), never from RTK Query cache or Supabase directly.
2. **RTK Query is ONLY for background sync.** On query resolution → upsert into Realm → UI reacts automatically.
3. **Never pass Realm objects in navigation params.** Pass only `id`/`slug`. Resolve the object in the destination screen.
4. **All Realm writes inside `realm.write()`.** Keep transactions small and fast.
5. **Preserve local-only fields during upserts.** Read existing record first, merge, then write.

---

## Architecture (Repository Pattern)

```
 UI  ──→  Repository  ──→  Realm (read/write)
                      ──→  RTK Query → Supabase (sync)
```

- **UI Layer**: Expo Router screens. Subscribes to Realm live objects. Calls Repository methods for mutations.
- **Repository Layer**: Single API surface (`getCourses()`, `enrollInCourse(id)`). Writes to Realm first (instant UI), then dispatches RTK Query mutation in background.
- **Data Layer**: Realm for local storage. RTK Query + Supabase for remote.

---

## Data Flow

### Sync Down (Remote → Local)
1. RTK Query fires (e.g. `useGetCoursesQuery()`).
2. `onQueryStarted` → await `queryFulfilled`.
3. Bulk upsert response into Realm, preserving local-only fields.

### Render (Local → UI)
```typescript
const courses = useQuery(Course);
```

### Sync Up (Local → Remote)
1. Write to Realm immediately (`sync_status = 'pending'`).
2. Dispatch RTK Query mutation in background.
3. On success → set `sync_status = 'synced'`.
4. On failure → leave pending, retry when online.

---

## Database Schemas

### Supabase (Remote)

**`courses`**: `id` UUID PK · `title` VARCHAR · `description` TEXT · `cover_image_url` VARCHAR · `created_at` TIMESTAMPTZ

**`chapters`**: `id` UUID PK · `course_id` UUID FK→courses · `title` VARCHAR · `content` TEXT · `order_index` INT · `created_at` TIMESTAMPTZ

### Realm (Local) — mirrors remote + local-only fields

**`Course`**: `id` string PK · `title` string · `courseDescription` string? · `coverImageUrl` string? · `chapters` Chapter[] · **`is_enrolled`** bool (local-only, default `false`) · **`sync_status`** string (local-only, default `'synced'`)

**`Chapter`**: `id` string PK · `courseId` string · `title` string · `content` string · `orderIndex` int · **`is_completed`** bool (local-only, default `false`)

---

## Coding Conventions

- **Engineering Principles**: Always follow best practices and adhere strictly to KISS, SOLID, and DRY principles.
- **Realm schemas**: Extend `Realm.Object`. Always set `primaryKey`. Use Realm types (`string`, `int`, `bool`).
- **FlashList**: Always provide `estimatedItemSize`. Wrap heavy `renderItem` in `React.memo`.
- **Reanimated**: All animated styles on UI thread (`useAnimatedStyle`, `useSharedValue`).
- **RTK Query services**: Use `createApi`. Upsert logic lives in `onQueryStarted`, NOT in components.
