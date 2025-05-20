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
- [ ] Browsing messages

#### Projects

- [x] Browsing project
  - [x] Submitting translations
  - [ ] Translation voting
- [ ] Updating _last_project_visit_
- [x] Creating project
  - [x] Importing entries from CSV
  - [x] Contributor multiselect
  - [x] Inviting members
- [x] Accepting and rejecting invitations
- [x] Browsing projects
  - [x] Accepting and declining invitations
- [ ] Filtering projects (by name and language)
- [x] Leaving project
- [ ] Project owner dashboard
  - [ ] Editing existing project (description, notes)
  - [ ] Inviting members
  - [ ] Adding entries
  - [ ] Deleting translations
  - [ ] Exporting translations to CSV
- [ ] Promoting contributors to managers
- [ ] Project changelog (updated fields, added or removed entries, users etc)

#### Testing

- [ ] Backend setup
  - [ ] Improved coverage
- [x] Frontend setup
  - [ ] Improved coverage
- [x] CI

#### Bugs To Fix

- [ ] Submitting a translation doesn't update the pending(n) count in entries list and the translations doesn't appear immediately under translations
- [ ] User multiselect sometimes unselects the wrong user
