# Security Specification - Smart Campus Notice Board

## 1. Data Invariants
- A notice must have a valid title, content, and category.
- Every notice must be associated with an author ID that matches the poster's UID.
- Only users with `Faculty`, `DeptAdmin`, or `SuperAdmin` roles can create or update notices.
- Students can only read notices and their own profiles.
- Users cannot change their own roles (this must be set by an admin).
- Urgency must be one of the predefined values.

## 2. The "Dirty Dozen" Payloads (Deny List)
1. **Identity Spoofing**: Post a notice where `authorId` is not the current user's UID.
2. **Role Escalation**: Self-update `User` document to change `role` to `SuperAdmin`.
3. **Ghost Field Injection**: Adding a `isVerified: true` field to a notice by a non-admin.
4. **Invalid Type**: Sending a boolean for the `title` field.
5. **Size Attacks**: Sending a 2MB string for the notice `content`.
6. **Path Poisoning**: Using a 2KB string as a `noticeId`.
7. **Bypassing Category**: Setting `category` to a value not in the enum.
8. **Unauthorized Update**: A student trying to update any notice.
9. **Relational Break**: Posting a notice with a non-existent department.
10. **PII Leak**: A student attempting to read another student's PII (if any).
11. **Shadow Update**: Updating a terminal state (if any) - notice expiry shouldn't be reversible by students.
12. **Blanket Read Scam**: Listing all user profiles (including PII) as a guest.

## 3. Test Runner (Draft)
I will implement a `firestore.rules.test.ts` (conceptual) that would verify these.
