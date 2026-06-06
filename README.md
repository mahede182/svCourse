# Course App

A mobile application where users can browse, enroll in, and study courses entirely offline. Background synchronization with Supabase happens transparently when connectivity is available.

## Tech Stack Used

- **Framework**: Expo Router (SDK 54) / React Native
- **Local Database**: Realm (`@realm/react`)
- **Remote Database & Auth**: Supabase
- **Network Sync**: RTK Query (`@reduxjs/toolkit`)
- **State Management**: Redux Toolkit (RTK)
- **Animations**: `react-native-reanimated`
- **Testing**: Jest, `jest-expo`

## Architecture Explanation

This application employs a strict Repository Pattern to cleanly separate the UI, local state, and remote synchronization logic.

```text
 UI  ──→  Repository  ──→  Realm (read/write)
                      ──→  RTK Query → Supabase (sync)
```

- **UI Layer**: Built with Expo Router. Screens subscribe to Realm live objects for instant, reactive updates and never await network requests for UI changes.
- **Repository Layer**: Provides a single API surface for mutations (e.g., `CourseRepository.toggleEnrollment()`). It writes to Realm immediately and dispatches RTK Query mutations in the background.
- **Data Layer**: Uses Realm as the single source of truth for local storage. RTK Query handles remote fetching and syncing with Supabase.

## Offline-First Strategy

1. **Local-First Rendering**: Realm is the *sole source of truth* for the UI. The UI components read exclusively from Realm hooks (`useQuery`, `useObject`), never directly from the RTK Query cache or Supabase.
2. **Background Synchronization (Sync Down)**: RTK Query triggers data fetches (e.g., `useGetCoursesQuery()`). On query resolution, the response is bulk-upserted into Realm, carefully preserving local-only state (such as enrollment status). The UI reacts automatically to the Realm updates.
3. **Optimistic Mutations (Sync Up)**: Mutations are written to Realm immediately with a `sync_status = 'pending'` flag. RTK Query mutations are dispatched in the background. On success, the flag is updated to `'synced'`. On failure, the mutation remains pending and can be retried when online.

## State Management Decision

We utilize **Redux Toolkit (RTK)** and **RTK Query** exclusively for handling remote API synchronization, global UI state (like active search queries and filters), and background fetch triggers. 

**Why not use Redux for entity data?** 
To achieve a robust offline-first architecture, local device persistence is absolutely required. Realm provides an embedded, reactive database that persists across app restarts and allows UI components to auto-update via `useQuery`. Mixing entity data into Redux would require complex, manual hydration/dehydration cycles to `AsyncStorage` and would defeat the purpose of an embedded local database.

## Setup Instructions

1. Clone the repository and navigate to the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env` file (for example `env-example` and for supabase setup see Supabase Setup below).
4. Run the development server:
   ```bash
   npx expo start
   ```

## Supabase Setup Details

1. Create a new Supabase project.
2. Run the SQL schema scripts (based on the Table Schema above) in the Supabase SQL Editor.
3. Create a `.env` file in the root of the project with your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=<supabase_url>
   EXPO_PUBLIC_SUPABASE_KEY=<supabase_key>
   ```
4. Configure Authentication in Supabase to enable Email/Password login.

## Test Credentials

| Email | Password |
|---|---|
| `test@gmail.com` | `123456` |

## Testing Instructions

The project uses `jest-expo` for testing the repository layer and business logic without requiring a native environment. Native Realm C++ bindings are mocked inside `jest.setup.js` to prevent Node.js crashes during test execution.

To run the test suite:
```bash
npm test
```

### Testing Cover

| Test Suite | Description |
|---|---|
| **Sync Logic** | Tests verify that `upsertFromRemote` maps remote Supabase data to the local Realm schema while preserving local fields (like `enrolledUsers` and `sync_status`). |
| **Search & Filter Logic** | Tests verify the Realm chaining mechanisms (`.filtered()`, `.sorted()`) correctly evaluate search queries, premium filters, and sorting offline. |
| **Enrollment Update Logic** | Tests verify that `toggleEnrollment` correctly updates the local state and flips the background `sync_status` to `pending`. |

## Known Limitations

- **Background Sync Without App Open**: The app currently relies on RTK Query running while the app is active or backgrounded in memory. Headless background syncing (e.g., iOS Background Fetch) is not fully implemented.
- **Large Assets**: Course videos or heavy images are not cached for offline use by default unless explicitly downloaded by the user or handled by the `expo-image` disk cache.
