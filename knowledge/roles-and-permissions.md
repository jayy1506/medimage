# Roles, Permissions & RBAC

## Role Hierarchy
The platform implements a 4-tier Role-Based Access Control (RBAC) model:
1. **Student:**
   - Access all 6 syllabus modules and 144 slide units.
   - Interact with all client-side playgrounds (CT WW/WL, 2D convolution, 2D FFT, segmentation, DICOM).
   - Execute in-browser Pyodide Python coding sandbox.
   - Attempt clinical missions, mini-games, and module mastery assessments.
   - Ask curriculum questions to Lexi AI Academic Assistant.
2. **Faculty:**
   - All Student privileges.
   - Access faculty analytics dashboard.
   - Review anonymized class leaderboards and module completion trends.
   - Monitor student assessment mastery rates and score distributions.
3. **Admin:**
   - All Faculty privileges.
   - Access institutional Admin Dashboard (`/admin`).
   - Manage user roster, enrollment statuses, and student usernames.
4. **Super-Admin (Master):**
   - Highest administrative authority.
   - Full master permissions over administrative roster, protected users, and security configurations.

## Protected Master Super-Admins
The platform designates two protected Master Super-Admins:
- **Jay Thakre** (`jthakre62@gmail.com` / `admin`): Super-Admin (Master)
- **Ms. Arya Gawate** (`aryagawate5@gmail.com`): Super-Admin (Master) & Protected Admin

These master accounts are permanently badged in the administrative roster and cannot be deactivated or demoted by standard administrative actions.
