# Eventora CRM — Project Documentation

## 1. Project Overview

**Eventora CRM** is a web-based Event Management Customer Relationship Management system built using the MERN stack. It helps manage event booking requests, quotations, vendor applications and assignments, customer payments, vendor payments, expenses, and event-level financial reports.

### Objectives

- Manage multiple event types through a centralized system.
- Allow customers to submit event booking requests and review quotations.
- Allow vendors to register, manage services, and apply for relevant event opportunities.
- Give Admin full control over quotations, booking confirmation, vendor selection, payments, and expenses.
- Track event progress and calculate estimated event profit.

### Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| API Requests | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Token (JWT) |
| Password Hashing | bcryptjs |

---

## 2. Roles & Features

Eventora CRM contains exactly three user roles:

1. Admin
2. Customer
3. Vendor

There is no separate Event Manager role.

### 2.1 Admin

Admin has complete control over the CRM.

#### Dashboard

- Total bookings
- Total customers
- Total vendors
- Recognized revenue
- Recorded expenses
- Estimated profit
- Upcoming events
- Recent bookings
- Quotations pending
- Vendor work status
- Recent payments
- Revenue and expense charts

#### Booking Management

- View all booking requests
- Filter bookings by status
- View customer and event details
- Review customer requirements
- Prepare and send quotations
- Review customer quotation acceptance or rejection
- Manually confirm bookings
- Update overall event status

#### Quotation Management

Admin can prepare a quotation using:

- Service
- Selected vendor
- Quantity
- Vendor fixed price
- Additional charges
- Total quotation amount

Vendor-managed fixed prices should be preserved unless Admin records a clearly defined additional charge or adjustment.

#### Vendor Management

- View vendor profiles
- Filter vendors by service category
- Review vendor applications
- Approve or reject vendor applications
- Assign approved vendors to events
- View vendor services and fixed prices
- View assignment history
- View vendor payment summaries
- Track vendor work status

#### Vendor Assignment

- Review vendor applications
- Select the appropriate vendor
- Assign vendor to an event
- Record agreed vendor cost
- Track work status:
  - Pending
  - In Progress
  - Completed

Admin makes the final vendor selection. Vendors cannot accept or reject assignments.

#### Customer Management

- View customer profiles
- View booking history
- View quotation status
- View payment history
- View customer contact information

#### Customer Payment Management

- Record confirmed booking amount
- Record advance payment
- Record partial payments
- Record final payment
- View total amount paid
- View outstanding balance
- View payment history

No online payment gateway is included in the current project scope. Payments are recorded manually by Admin.

#### Vendor Payment Management

- Record agreed vendor cost
- Record advance or partial payments
- Record final payment
- View total amount paid
- View remaining vendor balance
- View vendor payment history

#### Expense Management

- Record event-related expenses
- Categorize expenses
- Filter expenses by category
- View event-wise expense totals

#### Reports

- Recognized event revenue
- Recorded expenses
- Estimated event profit
- Customer outstanding balances
- Vendor outstanding balances

#### Notifications

- Header notification bell
- Dedicated notifications page
- Read/unread status
- Notification filters

#### Settings

- Admin profile
- Change password
- Logout

---

### 2.2 Customer

#### Authentication

- Customer signup
- Common login page shared with Admin
- Secure login using email and password

#### Landing Page

- Event banner
- Event categories
- Event type cards
- Service information
- Package cards

#### Event Types

- Wedding
- Engagement
- Birthday
- Corporate
- Private Party

#### Packages

- Budget Friendly
- Standard
- Premium

Package prices may be displayed as estimated ranges. Final pricing is determined through the Admin quotation.

#### Booking Request

Customer submits:

- Event type
- Event date
- Venue
- Guest count
- Budget
- Selected services
- Additional requirements

#### Booking and Quotation

- View submitted booking request
- Wait for Admin to prepare quotation
- View quotation
- Accept or reject quotation
- Wait for Admin to confirm booking
- Track booking status
- View payment history
- View outstanding balance
- Track event completion

**Important rule:** Customers cannot directly edit or cancel a submitted booking request. Only Admin can make those changes.

---

### 2.3 Vendor

#### Authentication

- Separate Vendor Signup page
- Separate Vendor Login page
- Vendor account requires Admin approval before dashboard access

#### Vendor Signup

Vendor provides:

- Full name
- Email
- Phone
- Password
- Business name
- Service categories

The backend assigns the `vendor` role. The signup form must not allow users to choose their own role.

#### Approval

Vendor account statuses:

- Pending
- Approved
- Rejected

A pending or rejected vendor cannot access the vendor dashboard.

#### Vendor Dashboard

- New Opportunities
- Applied Events
- Assigned Events
- Services and Prices
- Payment History

#### New Opportunities

- Admin sends category-matched event opportunities to vendors
- Vendor views relevant event details
- Vendor applies only once per event
- Vendor submits total price and a short note

#### Services and Pricing

- Add or manage services
- Set fixed prices
- Manage service categories

#### Assigned Events

- View Admin-assigned events
- View event details
- View agreed cost
- Track work status

Vendor work status:

- Pending
- In Progress
- Completed

#### Payment History

- View agreed vendor cost
- View amount paid
- View remaining balance
- View payment history

---

## 3. Workflow

### 3.1 Customer Booking Workflow

1. Customer signs up or logs in.
2. Customer browses event types and services.
3. Customer selects services.
4. Customer submits a booking request.
5. Booking status becomes `Pending`.
6. Admin reviews the request.
7. Admin prepares and sends a quotation.
8. Booking status becomes `Quotation Sent`.
9. Customer reviews the quotation.
10. Customer accepts or rejects the quotation.
11. If rejected, Admin reviews the next action.
12. If accepted, Admin manually confirms the booking.
13. Booking status becomes `Confirmed`.
14. Admin manages vendor assignments and payments.
15. Event progresses through its lifecycle.
16. Event is marked `Completed`.

### 3.2 Booking Statuses

Recommended booking status values:

- `Pending`
- `Under Review`
- `Quotation Pending`
- `Quotation Sent`
- `Quotation Rejected`
- `Accepted`
- `Confirmed`
- `Completed`
- `Rejected`

Quotation acceptance does **not** automatically confirm the booking. Admin must manually confirm it.

### 3.3 Vendor Workflow

1. Vendor signs up.
2. Backend creates a User account with role `vendor`.
3. Backend creates a Vendor profile with approval status `pending`.
4. Admin reviews the vendor application.
5. Admin approves or rejects the vendor.
6. Approved vendor manages services and fixed prices.
7. Admin sends relevant event opportunities to category-matched vendors.
8. Vendor applies to an event once, submitting price and note.
9. Admin reviews vendor applications.
10. Admin selects and assigns the vendor.
11. Vendor views the assigned event.
12. Vendor work status moves from `Pending` to `In Progress` to `Completed`.
13. Admin records vendor payments.

### 3.4 Admin Quotation and Assignment Workflow

1. Admin opens a booking request.
2. Admin reviews event details and customer requirements.
3. Admin selects services and suitable vendors.
4. Admin prepares the quotation.
5. Admin sends quotation to the customer.
6. Customer accepts or rejects it.
7. If accepted, Admin manually confirms the booking.
8. Admin finalizes vendor assignments.
9. Admin records customer and vendor payments.
10. Admin records relevant expenses.
11. Admin tracks event progress and financial results.

### 3.5 Event Status vs Vendor Work Status

These are separate statuses and must not be merged.

**Overall Event Status** tracks the event lifecycle.

**Vendor Work Status** tracks an individual vendor’s assigned work.

Example:

- Event Status: `Confirmed`
- Photography Vendor Status: `In Progress`
- Catering Vendor Status: `Pending`

---

## 4. Architecture

### 4.1 High-Level Architecture

```text
React + Vite Frontend
        |
        | Axios HTTP Requests
        v
Node.js + Express REST API
        |
        | JWT Authentication
        | Role-Based Authorization
        v
Controllers and Business Logic
        |
        v
Mongoose Models
        |
        v
MongoDB Database
```

### 4.2 Frontend Structure

```text
client/
├── public/
└── src/
    ├── components/
    ├── layouts/
    ├── modules/
    │   ├── auth/
    │   │   └── Login.jsx
    │   ├── admin/
    │   ├── customer/
    │   │   ├── auth/
    │   │   │   └── CustomerSignup.jsx
    │   │   ├── pages/
    │   │   └── dashboard/
    │   └── vendor/
    ├── routes/
    ├── services/
    │   └── api.js
    ├── App.jsx
    └── main.jsx
```

### 4.3 Backend Structure

```text
server/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Vendor.js
│   │   ├── Booking.js
│   │   ├── Quotation.js
│   │   ├── Payment.js
│   │   └── Expense.js
│   ├── controllers/
│   │   └── authController.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── utils/
│   │   └── seedAdmin.js
│   └── server.js
├── .env
├── .gitignore
└── package.json
```

### 4.4 Database Models

#### User

Stores common account details:

- `fullName`
- `email`
- `phone`
- `password` — bcrypt hash only
- `role` — `admin`, `customer`, or `vendor`
- `isActive`
- timestamps

#### Vendor

Stores vendor-specific information:

- `userId` — reference to User
- `businessName`
- `serviceCategories`
- `approvalStatus`
- `packageTier`
- timestamps

#### Booking

Stores:

- Customer reference
- Event type
- Event date
- Venue
- Guest count
- Budget
- Selected services
- Requirements
- Booking status
- Overall event status

#### Quotation

Stores:

- Booking reference
- Quotation items
- Service
- Selected vendor
- Quantity
- Unit price
- Additional charges
- Total quotation amount
- Quotation status
- Created and updated timestamps

#### Payment

Stores manual payment records for customers or vendors:

- Related booking
- Payment type
- Related customer or vendor
- Amount
- Payment date
- Payment method
- Notes
- Recorded by Admin

#### Expense

Stores:

- Related booking/event
- Expense category
- Description
- Amount
- Expense date
- Recorded by Admin

### 4.5 Authentication and Authorization

- Passwords are hashed using bcryptjs.
- JWT is issued after successful login.
- Protected API requests use `Authorization: Bearer <token>`.
- Authentication middleware verifies the token and loads the user.
- Role middleware restricts APIs by role.
- Frontend role-based routing is for navigation only; backend authorization is the actual security layer.
- Public signup endpoints must never allow users to create Admin accounts.
- Admin account is created through a secure seed script.

### 4.6 Authentication Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/customer/signup` | Customer signup |
| POST | `/api/auth/vendor/signup` | Vendor signup |
| POST | `/api/auth/login` | Admin and Customer login |
| POST | `/api/auth/vendor/login` | Vendor login |
| GET | `/api/auth/me` | Get authenticated user |

### 4.7 Role-Based Access Summary

| Feature | Admin | Customer | Vendor |
|---|---:|---:|---:|
| Manage all bookings | Yes | No | No |
| Submit booking request | No | Yes | No |
| View own booking | No | Yes | No |
| Prepare quotation | Yes | No | No |
| Accept/reject quotation | No | Yes | No |
| Confirm booking | Yes | No | No |
| Approve vendors | Yes | No | No |
| Apply to opportunities | No | No | Yes |
| Assign vendors | Yes | No | No |
| Manage own services/prices | No | No | Yes |
| Record customer payments | Yes | No | No |
| Record vendor payments | Yes | No | No |
| Record expenses | Yes | No | No |
| View financial reports | Yes | No | No |

---

## 5. Calculation Guide

All calculations should be performed or validated by the backend. The frontend may display calculated values, but it must not be trusted as the source of financial truth.

### 5.1 Quotation Item Total

For each quotation item:

```text
Item Total = Quantity × Unit Price
```

Example:

```text
Photography
Quantity = 1
Unit Price = ₹25,000

Item Total = 1 × ₹25,000 = ₹25,000
```

### 5.2 Quotation Total

```text
Quotation Total =
Sum of All Item Totals
+ Additional Charges
- Discounts
```

If discounts are not part of the current UI, omit the discount term.

Example:

```text
Photography        ₹25,000
Decoration         ₹18,000
Catering           ₹40,000
Additional Charges  ₹2,000

Quotation Total = ₹85,000
```

### 5.3 Customer Outstanding Balance

```text
Customer Outstanding Balance =
Confirmed Booking Amount
- Total Customer Payments
```

Example:

```text
Confirmed Booking Amount = ₹85,000
Advance Payment          = ₹20,000
Partial Payment          = ₹15,000

Total Paid = ₹20,000 + ₹15,000 = ₹35,000

Outstanding Balance = ₹85,000 - ₹35,000 = ₹50,000
```

The outstanding balance must not become negative. If overpayment is allowed, it should be represented separately as a customer credit/refund balance.

### 5.4 Vendor Outstanding Balance

For each vendor:

```text
Vendor Outstanding Balance =
Agreed Vendor Cost
- Total Payments Made to Vendor
```

Example:

```text
Agreed Vendor Cost = ₹25,000
Advance Payment    = ₹10,000
Final Payment      = ₹5,000

Total Paid = ₹15,000

Vendor Outstanding = ₹25,000 - ₹15,000 = ₹10,000
```

### 5.5 Total Event Expenses

```text
Total Event Expenses =
Sum of Relevant Recorded Expenses
```

Example:

```text
Transportation  ₹3,000
Printing        ₹1,500
Miscellaneous   ₹2,000

Total Expenses = ₹6,500
```

### 5.6 Recognized Event Revenue

For this project’s financial reporting:

```text
Recognized Event Revenue =
Confirmed Booking Amount
```

Customer payments received are tracked separately as cash collected.

**Important:** Do not treat the full quotation as recognized revenue before the booking is confirmed.

### 5.7 Estimated Event Profit

```text
Estimated Event Profit =
Recognized Event Revenue
- Relevant Event Expenses
```

Example:

```text
Recognized Event Revenue = ₹85,000
Relevant Event Expenses = ₹6,500

Estimated Event Profit = ₹85,000 - ₹6,500
                       = ₹78,500
```

### 5.8 Vendor Payment Double-Counting Rule

Vendor payments are **not recorded again as expenses** if the agreed vendor cost is already represented in the event’s financial calculation.

For this project:

- Customer revenue is the confirmed booking amount.
- Expenses are separately recorded relevant event expenses.
- Vendor payment records track how much of the agreed vendor cost has been paid.
- Vendor payments must not be added again to expenses unless the financial model is explicitly changed to treat vendor costs as expenses.

This avoids double-counting.

### 5.9 Financial Summary Example

| Financial Item | Amount |
|---|---:|
| Confirmed Booking Amount | ₹85,000 |
| Customer Payments Received | ₹35,000 |
| Customer Outstanding Balance | ₹50,000 |
| Relevant Event Expenses | ₹6,500 |
| Estimated Event Profit | ₹78,500 |

Vendor payment summary should be displayed separately:

| Vendor | Agreed Cost | Paid | Remaining |
|---|---:|---:|---:|
| Photography | ₹25,000 | ₹15,000 | ₹10,000 |

### 5.10 Calculation Rules

1. Store monetary values as numbers, not formatted strings.
2. Use INR (₹) for display.
3. Calculate totals from saved database records.
4. Validate payment amounts on the backend.
5. Do not allow payment records to exceed the amount due unless overpayment handling is explicitly supported.
6. Keep customer payment records and vendor payment records separate.
7. Do not double-count vendor payments as expenses.
8. Keep quotation acceptance separate from Admin booking confirmation.
9. Keep overall event status separate from vendor work status.
10. Use a consistent definition of recognized revenue across dashboard and reports.

---

## 6. Project Scope and Exclusions

### Included

- Admin, Customer, Vendor roles
- Customer signup and login
- Vendor signup and login
- Admin vendor approval
- Booking requests
- Quotations
- Manual booking confirmation
- Vendor applications and assignments
- Service and fixed-price management
- Manual customer payments
- Manual vendor payments
- Expense tracking
- Financial reports
- Notifications
- Dashboard summaries

### Not Included in Current Scope

- Separate Event Manager role
- Online payment gateway
- Customer self-editing or self-cancellation of submitted booking requests
- Vendor self-approval
- Vendor acceptance/rejection of Admin assignments
- Calendar module

---

## 7. Development Notes

- Keep the existing frontend design and pages intact.
- Connect frontend forms to backend APIs using Axios.
- Replace prototype/localStorage password authentication with backend authentication.
- Never store plain-text passwords.
- Never expose `.env` values in frontend code or public repositories.
- Use backend validation for all booking, quotation, payment, and expense operations.
- Protect Admin-only operations with authentication and role middleware.
- Test API endpoints before connecting them to frontend screens.

**Document:** `EVENTORA_CRM_DOCUMENTATION.md`  
**Project:** Eventora CRM  
**Stack:** MERN  
**Roles:** Admin, Customer, Vendor