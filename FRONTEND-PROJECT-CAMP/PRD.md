# Product Requirements Document (PRD)

## Project Camp Frontend

### 1. Product Overview
**Product Name:** Project Camp Web  
**Version:** 1.0.0  
**Product Type:** React-based Web Interface for Project Management

Project Camp Frontend is the visual interface for the Project Camp RESTful API. It provides a collaborative workspace where users can interact with project boards, manage hierarchical tasks and subtasks, and maintain project documentation while adhering to strict role-based access controls.

---

### 2. Target Users
* **Project Administrators:** Access to the full administrative suite, including project creation, user role assignment, and global deletion tools.
* **Project Admins:** Mid-level access to manage task lifecycles, assignees, and project content within their assigned scopes.
* **Team Members:** View-only access to project overview and notes, with permission to update task progress and complete subtasks.

---

### 3. Core Features (Targeting Backend 3.1 - 3.7)

#### 3.1 User Authentication & Onboarding
* **User Registration:** Interface to collect user credentials and trigger account creation with email verification.
* **Secure Login:** JWT-based login form with local storage/cookie management for session persistence.
* **Password Management:** Dedicated views for password changes and a "Forgot Password" flow with token-based reset.
* **Email Verification Landing:** A dedicated route (`/verify-email/:token`) that captures the URL token to verify account status via the API.
* **Token Refresh Logic:** Automatic background handling of access token expiration using the refresh token mechanism.

#### 3.2 Project Dashboard
* **Project Creator:** Admin-only modal/form for defining new project names and descriptions.
* **Project Grid:** A visual list of accessible projects displaying essential metadata and member counts.
* **Project Settings:** Interface for Admins to modify project details or perform permanent deletions.

#### 3.3 Team & Member Management
* **Invitation System:** Form to invite new users to specific projects via email input.
* **Member Directory:** Table view listing all project participants and their current roles.
* **Role Administration:** Admin-only dropdowns within the member list to update tiers (e.g., promoting a Member to Project Admin).

#### 3.4 Task Board & Assignment
* **Task Creator:** Form to define tasks including title, description, and an assignee dropdown populated by project members.
* **Kanban/List View:** Visual tracking of tasks across the three-state status system: `todo`, `in_progress`, and `done`.
* **File Attachment UI:** Multi-file upload zone for tasks, displaying file metadata (size, type) and preview links.

#### 3.5 Hierarchical Subtask Management
* **Subtask Nested List:** Expandable task view to manage a checklist of subtasks.
* **Status Toggles:** Interactive checkboxes allowing members to mark subtasks as complete in real-time.

#### 3.6 Project Documentation (Notes)
* **Notes Workspace:** A collaborative area for project documentation.
* **Note Administration:** Restricted buttons for creating, updating, or deleting notes, visible only to high-level Admins.

#### 3.7 System Monitoring
* **Service Status Indicator:** A UI element (e.g., a "System Online" badge) that pings the health check endpoint on app load.

---

### 4. Technical Specifications

#### 4.1 API Integration Structure (Targeting Backend 4.1)

| Frontend View | Target Endpoint Route | Auth Level |
| :--- | :--- | :--- |
| **Auth Pages** | `/api/v1/auth/` | Public / Verified |
| **Project Dashboard** | `/api/v1/projects/` | Secured (JWT) |
| **Task View** | `/api/v1/tasks/` | Secured (Role-based) |
| **Notes Tab** | `/api/v1/notes/` | Secured (Role-based) |
| **App Footer** | `/api/v1/healthcheck/` | Public |

#### 4.2 UI Permission Matrix (Targeting Backend 4.2)

| Interface Element | Admin View | Project Admin | Member |
| :--- | :--- | :--- | :--- |
| "+ New Project" Button | Visible | Hidden | Hidden |
| "Delete Project" Icon | Visible | Hidden | Hidden |
| Member Role Dropdown | Editable | View-only | View-only |
| "+ Add Task" Button | Visible | Visible | Hidden |
| "Edit Note" Button | Visible | Hidden | Hidden |
| Task Status Dropdown | Editable | Editable | Editable |

#### 4.3 State & Data Mapping (Targeting Backend 4.3)

**User Roles in Frontend Context:**
* `admin`: Full dashboard control and member management.
* `project_admin`: Task and subtask management within specific boards.
* `member`: Status updates and project viewing.

**Status Visual Mapping:**
* `todo`: Rendered in "Backlog" column.
* `in_progress`: Rendered in "Active" column.
* `done`: Rendered in "Completed" column.

---

### 5. Security & Validation (Targeting Backend 5)
* **Axios Interceptors:** Global handler for attaching JWTs and managing 401/Unauthorized responses for token refresh.
* **Frontend Guard Rails:** Route protection (Higher Order Components) to prevent unauthenticated access to secured views.
* **Input Validation:** Client-side validation to match backend schema requirements (email format, password strength).

---

### 6. Success Criteria (Targeting Backend 7)
* Secure and seamless user registration to verification journey.
* Dynamic rendering of UI components based on the 3-tier permission system.
* Successful upload and retrieval of task attachments via Multer endpoints.
* Accurate real-time state updates for subtasks across all team members.