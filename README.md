# Startline

Plan, learn and run an online business, step by step. Startline has 7-day plans, with an optional second week, for 18 ways to earn online (dropshipping, print on demand, affiliate marketing, selling your own things, tutoring, stream clipping, UGC and more) in the US, UK, EU, Canada, Australia, India, the Philippines, Nigeria, Brazil and elsewhere. It has tasks, lessons, courses, calculators, a sales log, calendar reminders and links to the platforms you'll use. Every fact links to its source, and nothing in it promises income.

It runs in any modern browser on phones, tablets and computers, and can be installed like an app. It works offline once it has loaded.

## How it saves your work

- **Without an account**, everything is saved in your own browser and never leaves your device.
- **With an account** (optional, once you turn accounts on below), work is saved to a private database and follows you to every device where you sign in. Each account can only read its own data; this is enforced by the database itself (row-level security), not just by the app.

Someone who starts without an account can create one later; Startline offers to copy their browser's work into it.

## Put it online with GitHub Pages

GitHub Pages hosting is free for public repositories.

1. In this repository on GitHub, open **Settings > Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose the **main** branch and the **/ (root)** folder, then **Save**.
3. After a minute or two the site is live at `https://<your-github-username>.github.io/<repository-name>/`.

At this point Startline works for everyone, with work saved in each person's browser.

## Turn on accounts (Supabase)

Accounts use [Supabase](https://supabase.com), which has a free plan. You need to do this once.

1. **Create a project.** Sign in at [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project.
2. **Create the database table.** In the project, open **SQL Editor**, start a new query, paste everything from [`supabase/schema.sql`](supabase/schema.sql) and run it. It creates the table for saved work, locks every row to the account that owns it, caps how much one account can store, and adds the "Delete my account" function. It also creates an insert-only `feedback` table for anonymous feedback and check-ins (see below). Running it again is safe.
3. **Tell Supabase where the app lives.** Open **Authentication > URL Configuration**:
   - **Site URL**: your Pages address, for example `https://<your-github-username>.github.io/<repository-name>/`
   - **Redirect URLs**: add the same address followed by `**`, for example `https://<your-github-username>.github.io/<repository-name>/**`. Email confirmation and password-reset links only open addresses on this list.
4. **Set up email.** Sign-up confirmations and password resets are sent by email. Supabase's built-in email service is only for trying things out: it sends only to members of your Supabase organization's team, and only a couple of messages an hour. For real users, connect your own email provider in the **SMTP Settings** of the **Authentication** section's email settings (any SMTP service works), then raise the hourly email limit under **Authentication > Rate Limits** if you need to. While testing, you can turn off **Confirm email** for the Email provider so new accounts can sign in straight away.
5. **Connect the app.** Open **Project Settings > API Keys** and copy the project URL and the **publishable** key (older projects call it the **anon** key). Paste both into [`config.js`](config.js):

   ```js
   window.STARTLINE_CONFIG = {
     supabaseUrl: "https://your-project-ref.supabase.co",
     supabaseAnonKey: "your-publishable-or-anon-key",
     googleSignIn: false,
   };
   ```

   This key is meant to be public; the row-level security from step 2 is what keeps each account private. **Never** put the `service_role` or secret key in this file.
6. Commit and push. The sign-in screen appears the next time the site loads.

### Optional: "Continue with Google"

In Supabase, open **Authentication > Sign In / Providers > Google** and follow the steps there (you'll create an OAuth client in Google Cloud and paste its client ID and secret into Supabase). Then set `googleSignIn: true` in `config.js`.

### Good to know

- **Free Supabase projects pause after about a week with little activity.** A paused project shows a "can't reach the server" message on sign-in until you restore it from the Supabase dashboard; work saved without an account is not affected. Paid plans don't pause.
- **Custom Supabase domain:** if your project uses a custom domain instead of `*.supabase.co`, add it to the `connect-src` list in the Content-Security-Policy line at the top of `index.html`.
- **Deleting accounts:** people can delete their own account in the app (Account > Delete my account). You can also delete users in the Supabase dashboard under **Authentication > Users**; their saved data is removed with them.

## Privacy and terms pages

`privacy.html` and `terms.html` are plain-language pages linked from the sign-up form. Fill in `operatorName` and `contactEmail` in `config.js` so they say who runs the site and how to reach them. Use a project name and a dedicated address, not personal ones.

## Feedback and check-ins

With accounts turned on, people can send feedback from **Settings > Send feedback**, and from day 7 the Today screen asks once, "how's it going?" (made money / not yet / stopped). Both are anonymous: only the message or answer, the way they're earning and the plan day are stored, with no user id or email. Read them in the Supabase dashboard under **Table Editor > feedback**; nobody can read them through the app or the API. Without accounts, Settings shows an "Email feedback" link if `contactEmail` is set.

## Visitor statistics (optional)

Startline can count visits and a few milestones (plan built, first step done, week 2 added) with [GoatCounter](https://www.goatcounter.com), which uses no cookies and doesn't identify people. Nothing anyone types is sent. Create a GoatCounter site, then set `analytics: { provider: "goatcounter", code: "your-site-code" }` in `config.js`. The privacy page then mentions it automatically.

## Try it on your computer

Any static web server works. With Node.js installed:

```bash
npx http-server -p 8080 -c-1
```

Then open <http://localhost:8080/>. To use accounts locally, add `http://localhost:8080/**` to the Supabase Redirect URLs.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page: layout and the order scripts load in |
| `styles.css` | All styles, light and dark |
| `app.js` | The app: plans, tasks, lessons, tools, accounts, saves |
| `platform.js` | Web-only layer: sign-in screen, Supabase storage, installing, offline |
| `config.js` | Your Supabase settings (empty means no accounts) |
| `sw.js` | Service worker that makes the app work offline |
| `manifest.webmanifest`, `icons/` | What phones and computers use when the app is installed |
| `vendor/supabase.js` | [supabase-js](https://github.com/supabase/supabase-js) 2.117.1, MIT licence (see `vendor/supabase-js.LICENSE`) |
| `supabase/schema.sql` | Database setup for accounts |
| `tools/build-artifact.mjs` | Builds the single-file version that runs inside claude.ai |
| `tools/stamp.mjs` | Adds release stamps (`?v=…`) so browsers fetch changed files; run it after editing any file |
| `privacy.html`, `terms.html`, `legal.js` | The privacy and terms pages, filled in from `config.js` |
| `fonts/` | Self-hosted fonts (Unbounded, Instrument Sans, DM Mono; OFL licences in `fonts/LICENSES.txt`) |
| `robots.txt` | Lets search engines index the site |
| `tests/` | Automated checks: the database rules, and the app end to end in a real browser |

After changing any file, run `node tools/stamp.mjs`. It updates the release stamps in `index.html` and `sw.js`, so installed copies pick up the new files; the checks fail if you forget.

## Run the checks

The checks need Node.js 20 or newer.

```bash
cd tests
npm install
npx playwright install chromium   # first time only
npm test
```

`npm test` first checks `supabase/schema.sql` in a real Postgres database (each account can only reach its own rows, the size limits, account deletion), then opens the app in Chromium and goes through it end to end: using it without an account, signing up, signing in on two devices, password reset, email confirmation, bringing browser work into an account, deleting an account, installing, working offline, and accessibility. Accounts are tested against a local stand-in for Supabase that runs the same schema, so no Supabase project is needed.
