# Team Member File Mapping - Smart Campus Project

This document organizes the project files by team member responsibilities. Files that relate to multiple members are placed with the primary owner and note collaboration requirements.

---

## Member 1: Facilities Catalogue + Resource Management Endpoints (Kalani)

### Backend

#### Controllers
- `backend/src/main/java/com/pafproject/backend/controller/ResourceController.java`

#### Services
- `backend/src/main/java/com/pafproject/backend/service/ResourceService.java`

#### Models
- `backend/src/main/java/com/pafproject/backend/model/Resource.java`
- `backend/src/main/java/com/pafproject/backend/model/ResourceType.java`
- `backend/src/main/java/com/pafproject/backend/model/ResourceStatus.java`

#### Repositories
- `backend/src/main/java/com/pafproject/backend/repository/ResourceRepository.java`

#### DTOs
- `backend/src/main/java/com/pafproject/backend/dto/ResourceRequest.java`
- `backend/src/main/java/com/pafproject/backend/dto/ResourceResponse.java`

### Frontend

#### Pages
- `frontend/src/pages/resources/ResourceCataloguePage.jsx` - View resources catalogue with filtering
- `frontend/src/pages/resources/AdminResourcesPage.jsx` - Admin CRUD for resources

#### Components
- `frontend/src/components/resources/ResourceCard.jsx` - Display individual resource details
- `frontend/src/components/resources/ResourceFormModal.jsx` - Form for adding/editing resources

---

## Member 2: Booking Workflow + Conflict Checking (Hasara)

### Backend

#### Controllers
- `backend/src/main/java/com/pafproject/backend/controller/BookingController.java`

#### Services
- `backend/src/main/java/com/pafproject/backend/service/BookingService.java` - Includes conflict prevention logic

#### Models
- `backend/src/main/java/com/pafproject/backend/model/Booking.java`
- `backend/src/main/java/com/pafproject/backend/model/BookingStatus.java`

#### Repositories
- `backend/src/main/java/com/pafproject/backend/repository/BookingRepository.java`

#### DTOs
- `backend/src/main/java/com/pafproject/backend/dto/BookingRequest.java`
- `backend/src/main/java/com/pafproject/backend/dto/BookingResponse.java`

### Frontend

#### Pages
- `frontend/src/pages/bookings/BookResourcePage.jsx` - User form to request resources
- `frontend/src/pages/bookings/MyBookingsPage.jsx` - User view for their bookings
- `frontend/src/pages/bookings/AdminBookingsPage.jsx` - Admin dashboard for booking approvals/rejections

#### Components
- `frontend/src/components/bookings/RejectModal.jsx` - Modal for rejecting bookings with reasons

**Note:** Also related to Member 2:
- `frontend/src/pages/AdminDashboard.jsx` - Hosts the booking approval workflow (admin support)

---

## Member 3: Incident Tickets + Attachments + Technician Updates (Imalsha)

### Backend

#### Controllers
- `backend/src/main/java/com/pafproject/backend/controller/TicketController.java`
- `backend/src/main/java/com/pafproject/backend/controller/TechnicianController.java`

#### Services
- `backend/src/main/java/com/pafproject/backend/service/TicketService.java`

#### Models
- `backend/src/main/java/com/pafproject/backend/model/Ticket.java`
- `backend/src/main/java/com/pafproject/backend/model/TicketStatus.java`
- `backend/src/main/java/com/pafproject/backend/model/TicketPriority.java`
- `backend/src/main/java/com/pafproject/backend/model/TicketCategory.java`
- `backend/src/main/java/com/pafproject/backend/model/TicketComment.java`

#### Repositories
- `backend/src/main/java/com/pafproject/backend/repository/TicketRepository.java`
- `backend/src/main/java/com/pafproject/backend/repository/TicketCommentRepository.java`

#### DTOs
- `backend/src/main/java/com/pafproject/backend/dto/TicketRequest.java`
- `backend/src/main/java/com/pafproject/backend/dto/TicketResponse.java`
- `backend/src/main/java/com/pafproject/backend/dto/TicketCommentRequest.java`
- `backend/src/main/java/com/pafproject/backend/dto/TicketCommentResponse.java`

### Frontend

#### Pages
- `frontend/src/pages/tickets/ReportTicketPage.jsx` - Form for users to report issues with attachments
- `frontend/src/pages/tickets/MyTicketsPage.jsx` - User view for their reported tickets
- `frontend/src/pages/tickets/TicketDetailPage.jsx` - Detailed ticket view with status updates and comments
- `frontend/src/pages/TechnicianDashboard.jsx` - Technician dashboard for ticket assignment and updates

#### Components
- `frontend/src/components/tickets/TicketCard.jsx` - Display ticket summary
- `frontend/src/components/tickets/CommentThread.jsx` - Display ticket comments and communication

---

## Member 4: Notifications + Role Management + OAuth Integration Improvements

### Backend

#### Controllers
- `backend/src/main/java/com/pafproject/backend/controller/AuthController.java` - OAuth 2.0 authentication
- `backend/src/main/java/com/pafproject/backend/controller/NotificationController.java`

#### Services
- `backend/src/main/java/com/pafproject/backend/service/NotificationService.java`
- `backend/src/main/java/com/pafproject/backend/service/JwtService.java` - JWT token generation and validation
- `backend/src/main/java/com/pafproject/backend/service/AppUserService.java` - User management for role management

#### Models
- `backend/src/main/java/com/pafproject/backend/model/Notification.java`
- `backend/src/main/java/com/pafproject/backend/model/NotificationType.java`
- `backend/src/main/java/com/pafproject/backend/model/Role.java`
- `backend/src/main/java/com/pafproject/backend/model/AppUser.java` - User model with role attributes

#### Repositories
- `backend/src/main/java/com/pafproject/backend/repository/NotificationRepository.java`
- `backend/src/main/java/com/pafproject/backend/repository/AppUserRepository.java`

#### Security
- `backend/src/main/java/com/pafproject/backend/security/SecurityConfig.java` - OAuth 2.0 and JWT configuration
- `backend/src/main/java/com/pafproject/backend/security/JwtAuthenticationFilter.java` - JWT token filter

#### DTOs
- `backend/src/main/java/com/pafproject/backend/dto/AuthResponse.java`
- `backend/src/main/java/com/pafproject/backend/dto/GoogleAuthRequest.java`
- `backend/src/main/java/com/pafproject/backend/dto/NotificationResponse.java`
- `backend/src/main/java/com/pafproject/backend/dto/UserResponse.java`

### Frontend

#### Pages
- `frontend/src/pages/LoginPage.jsx` - OAuth 2.0 Google Sign-In integration
- `frontend/src/pages/NotificationsPage.jsx` - Notification center for users
- `frontend/src/pages/Dashboard.jsx` - Main dashboard with role-based display

#### Components
- `frontend/src/components/NotificationBell.jsx` - Real-time notification indicator
- `frontend/src/components/ProtectedRoute.jsx` - Route protection based on authentication
- `frontend/src/components/RoleRoute.jsx` - Route protection based on user roles

#### Context
- `frontend/src/context/AuthContext.jsx` - Authentication state management
- `frontend/src/context/NotificationContext.jsx` - Notification state management

---

## Cross-Cutting / Supporting Components (All Members)

### Backend

#### Core Application
- `backend/src/main/java/com/pafproject/backend/BackendApplication.java`

#### Configuration
- `backend/src/main/java/com/pafproject/backend/config/AppConfig.java` - Application-wide configuration

#### Exception Handling
- `backend/src/main/java/com/pafproject/backend/exception/GlobalExceptionHandler.java` - Centralized exception handling

#### Controllers (General)
- `backend/src/main/java/com/pafproject/backend/controller/UserController.java` - General user profile endpoints
- `backend/src/main/java/com/pafproject/backend/controller/AdminController.java` - General admin endpoints

#### Repositories (General)
- `backend/src/main/java/com/pafproject/backend/repository/AppUserRepository.java` - Shared by all members

### Frontend

#### API Communication
- `frontend/src/api/api.js` - Centralized API client (used by all members)

#### Root Files
- `frontend/src/App.jsx` - Main application component
- `frontend/src/main.jsx` - Application entry point
- `frontend/src/index.css` - Global styles

#### Configuration & Asset Files
- `frontend/vite.config.js`
- `frontend/eslint.config.js`
- `frontend/package.json`

---

## Dependencies & Collaboration Notes

| Member | Primary Responsibility | Depends On | Supports |
|--------|----------------------|-----------|----------|
| **Member 1** | Resources & Catalogue | Member 4 (Auth) | Member 2, Member 3 |
| **Member 2** | Bookings & Conflicts | Member 1 (Resources), Member 4 (Auth) | Member 4 (Notifications) |
| **Member 3** | Tickets & Technicians | Member 4 (Auth) | Member 4 (Notifications) |
| **Member 4** | Notifications & Auth | All Members | All Members |

### Implementation Order
1. **Member 4 First** - OAuth, JWT, Role-Based Access Control foundation
2. **Member 1 Second** - Resources (needed by Member 2 and 3)
3. **Member 2 & 3 Parallel** - Bookings and Tickets
4. **All Members** - Integrate notifications from their modules

