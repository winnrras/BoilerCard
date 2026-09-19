# BoilerCard — project spec

A non-commercial, Purdue-only digital business card / contact-exchange app for
students. Student-to-student focus (clubs, hackathons), not a career-fair or
employer-facing tool. No monetization, no multi-university ambitions.

## Stack

- Next.js (App Router) + TypeScript, Tailwind CSS
- Supabase: Auth (email + password for now, restricted to @purdue.edu — Purdue's mail security made
  magic-link email unreliable in practice; plan is to migrate to Purdue SSO via Microsoft Entra ID
  once that's set up officially), Postgres, Storage (resume uploads)
- Deployed on Vercel

## Data model

**student**
- id (uuid, pk)
- purdue_email (string, unique, from Supabase Auth)
- slug (string, unique — used in the public profile URL)
- name (string)
- avatar_url (string, nullable — Supabase Storage)
- major (string, nullable)
- grad_year (int, nullable)
- bio (string, nullable, short — consider a ~140 char cap)
- linkedin_url (string, nullable)
- github_url (string, nullable)
- resume_url (string, nullable — Supabase Storage, uploaded file, not a pasted link)
- discord (string, nullable — plain username, not a URL)

No phone number field (deliberately excluded).

**club**
- id (uuid, pk)
- slug (string, unique)
- name (string)
- description (string, nullable)
- discord_url (string, nullable)
- created_by (uuid, fk -> student.id)

**club_membership** (join table)
- id (uuid, pk)
- student_id (uuid, fk -> student.id)
- club_id (uuid, fk -> club.id)
- visible (boolean, default false) — opt-in: a student must explicitly choose to
  appear on a club's public page. Never default to true on join.
- role (string, nullable) — self-declared display label only (e.g. "officer"),
  not an enforced permission.

Club pages are a thin, opt-in directory layered on top of personal profiles —
**not** a membership/roster management system (join requests, approvals,
elections). That functionality already exists officially via Purdue's
BoilerLink; don't rebuild it.

## Core flow

1. Sign in with @purdue.edu email + password (Supabase Auth)
2. Build profile — name pulled from account; photo, major, grad year all
   optional and fillable later so nobody is blocked from finishing signup
3. Get a shareable profile URL (`/u/[slug]`) with an auto-generated QR code
4. Anyone scans it → public profile page, no login required to view
5. (Separately) a student can opt into a club's directory from that club's page

## Public profile page

Shows, when present: photo, name, major + grad year, bio, LinkedIn, GitHub,
Discord (plain text, not a link — it's a handle to copy, not a URL), resume
(download), and a row of club tags for clubs they've opted into. Any missing
field collapses gracefully — no empty placeholders.

## Apple / Google Wallet

Not part of the MVP. If pursued later: Apple Wallet requires a Pass Type ID
certificate via the Apple Developer Program ($99/year) — a real cost for a
non-commercial project, so sequence it after the core web flow is validated.
The pass's `barcode.message` field points at the profile URL; Wallet renders
the QR natively, no manual QR image needed. Google Wallet's Generic pass type
is free to set up via the Google Wallet Console and isn't blocked the same way.

## Visual identity

- Colors: ink `#16130b` (background, warm near-black, not flat #000), panel
  `#1B1912` (card surface), gold `#BFA97E` (accent only — links, tags, never a
  filled background block), paper `#F4F1E8` (primary text), ash `#948C79`
  (secondary text)
- Wordmark: "Boiler" in gold, "Card" in paper/white, currently set in
  Montserrat, weight 700, dark background
- Principle: gold stays a thin accent — text color, an outline, never a
  gradient wash or a solid fill. Avoid anything that reads as a formal
  collegiate/varsity look; keep it sleek and modern instead.

## Explicitly out of scope for v1

- Employer accounts, career-fair features, any B2U/commercial layer
- Club membership administration (roster, join approval, elections)
- Phone number field
