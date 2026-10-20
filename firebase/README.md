# Sign-in, activity and the admin portal (Firebase)

The landing page is public. The course (`/course`, `/learn/futures-edge/...`) needs an account; `/signin` and
`/signup` handle email + password and "Continue with Google"; `/admin` shows learner activity to admins.
Code: `src/auth/` (sign-in, course gate, activity tracking) and `src/admin/` (portal).

Until the Firebase config below is set, sign-in is switched off and the course stays open to everyone.

## One-time setup (about 15 minutes, free "Spark" plan)

1. **Project.** https://console.firebase.google.com → Add project (e.g. `xora-website`). Google Analytics: optional.
2. **Web app.** Project overview → `</>` (Web) → register (no Hosting). Copy the `firebaseConfig` values.
3. **Sign-in methods.** Build → Authentication → Get started → Sign-in method:
   - Email/Password → Enable (leave "Email link" off).
   - Google → Enable → choose the support email → Save.
4. **Allowed websites.** Authentication → Settings → Authorized domains → Add `xora.xtinex.com` and
   `gentle-stone-0d854db00.2.azurestaticapps.net` (`localhost` is there already).
5. **Database.** Build → Firestore Database → Create database → production mode → location `asia-south1` (Mumbai).
6. **Rules.** Firestore → Rules → replace everything with `firebase/firestore.rules` → Publish.
7. **Config in the site.** Put the values from step 2 in `.env.production` (they are public, not secrets):

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=<project-id>.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=<project-id>
   VITE_FIREBASE_APP_ID=...
   VITE_ADMIN_EMAILS=tisan@xtinex.com
   ```

   Push to `main`; the deploy action builds with them.
8. **Admin.** Sign up at `/signin` with `tisan@xtinex.com` (Google, or email + password and then click the
   confirmation link in the email), then open `/admin`. More admins: add the email to `firestore.rules`
   (publish) and to `VITE_ADMIN_EMAILS`.

## What is recorded

| Where | What |
|---|---|
| `users/{uid}` | Name, email, sign-in method, joined, last seen, number of sign-ins, lessons started and completed, best quiz score per lesson and checkpoint, how far each lesson video was watched (25/50/75/100 %) |
| `events` | One record per activity: signed up, signed in, opened a lesson or checkpoint, started / 25 % / 50 % / 75 % / finished a video, completed a lesson, took a quiz or checkpoint |

The admin portal shows totals (learners, new this week, active today and this week, lessons completed, videos
finished), sign-ups per day, a per-lesson table (opened, watched, completed, average quiz score), the learner
list with search and CSV export, and recent activity. A Sales card is ready for when paid access is added.

## Limits to know

- The lesson video pages themselves (`/futures-edge/lessons/*.html`) are static files: the site only shows them
  to signed-in learners, but someone with a direct link could still open one. Protecting the files themselves
  needs the Azure Static Web Apps Standard plan (custom authentication) or moving them behind a server.
- Course progress is still saved in the learner's browser by the course app; a summary is copied to their account
  when they move between pages, every two minutes and when they leave.
- Free plan limits (Spark): 50,000 reads and 20,000 writes a day, 1 GiB stored. A learner uses roughly 20–60
  writes per hour of study; the admin page reads up to ~2,000 documents each time it loads.
