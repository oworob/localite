# Project Roadmap

#### Core Goals

1. High test coverage
2. Code open for extension & DRY
3. Usage of services
4. Reusable components
5. UX & Accessibility

#### Authentication & Users

- [x] Logging in
- [x] Creating account
- [ ] Editing user profile
  - [ ] Changing status
- [ ] Browsing users
- [ ] Live messages via sockets (browse window, redirect, delete, mark as read)

#### Projects

- [x] Browsing project
  - [x] Submitting translations
  - [ ] Translation voting
  - [ ] Requesting context
- [x] Updating _last_project_visit_
- [x] Creating project
  - [x] Importing entries from CSV
  - [x] Contributor multiselect
  - [x] Inviting members
- [x] Browsing projects
  - [x] Accepting and declining invitations
- [ ] Filtering projects (by name and language)
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
  - [ ] Deleting, approving translations
  - [ ] Exporting translations to CSV
  - [ ] Project statistics (languages summary, % translated, top translators)
- [ ] Promoting contributors to managers
- [x] Project changelog (updated fields, added or removed entries, users etc)

#### Testing

- [x] Backend setup
- [x] Frontend setup
- [x] CI

#### Bugs To Fix

- Submitting a translation doesn't update the pending(n) count in entries list and the translations doesn't appear immediately under translations
- Logging out sometimes doesn't redirect to login screen
- Notes should be unique
