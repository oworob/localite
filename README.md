# Project Roadmap

#### Core Project Goals

1. High test coverage
2. Code open for extension & DRY
3. Usage of services
4. Reusable components
5. UX & Accessibility
6. Smaller commits

#### Authentication & Users

- [x] Logging in
- [x] Creating account
- [ ] Editing user profile
  - [ ] Changing status
- [ ] Browsing users
- [x] Live messages via sockets (browse window, redirect, delete, mark as read)

#### Projects

- [x] Creating project
  - [x] Importing entries from CSV
  - [x] Contributor multiselect
  - [x] Inviting members
- [x] Browsing projects
  - [x] Accepting and declining invitations
- [x] Browsing project
  - [x] Updating _last_project_visit_
  - [x] Submitting translations
  - [x] Translation voting
  - [x] Deleting translations
  - [x] Requesting context
  - [x] Approving translations
- [x] Leaving project as a user
- [ ] Leaving project as an owner and passing ownership
- [x] Project owner dashboard
  - [x] Editing existing project (name, description)
  - [x] Editing notes
  - [x] Deleting project
  - [ ] Changing source language
  - [ ] Adding and removing target languages
  - [ ] Inviting, removing, promoting members
  - [ ] Adding, editing, deleting entries
  - [ ] Exporting translations to CSV
  - [ ] Project statistics (languages summary, % translated, top translators)
- [ ] Promoting contributors to managers
- [x] Project changelog (updated fields, added or removed entries, users etc)

#### Testing & Tools

- [x] Backend test setup
- [x] Backend linter
- [x] Frontend test setup
- [x] Frontend linter
- [x] CI

#### Issues To Fix

- Logging out sometimes doesn't redirect to login screen
- Notes should be unique per project
