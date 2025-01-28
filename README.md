# Project Roadmap

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
  - [ ] Editing project (description, notes)
  - [ ] Inviting members
  - [ ] Adding entries
  - [ ] Deleting translations
  - [ ] Exporting translations to CSV

#### Testing

- [ ] Backend setup
  - [ ] Improved coverage
- [x] Frontend setup
  - [ ] Improved coverage
- [x] CI

#### Bugs To Fix

- [ ] Submitting a translation doesn't update the pending(n) count in entries list

---

Pages:

- Login
- Register
- Entry Page
  - entry list
  - entry translations + form + voting
  - comment section
- Create Project
- Manage Project (inviting)
- Project list (with invites)

Entry statuses:

- pending (has at least one translation added)
- needs_translation (has zero translations)
- accepted (one of the translations was accepted by the project owner)
