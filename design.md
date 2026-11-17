# Smart Medical Record Management System
## UI/UX Design Specification

---

## 1. Design Vision

Create a modern, premium healthcare web application that feels trustworthy, clean, intelligent and easy to use.

The application should look like a professional digital healthcare platform, not a basic admin dashboard or file-storage website.

The design should communicate:

- Trust
- Security
- Simplicity
- Intelligence
- Accessibility
- Professional healthcare experience

---

## 2. Design Theme

### Overall Style

Use a modern healthcare SaaS design.

Design references:
- Linear for clean layouts.
- Stripe for polished dashboard design.
- Apple Health for healthcare-oriented simplicity.
- Modern SaaS dashboards for information organization.

Do not directly copy these products.

### Color Palette

**Primary**
| Token | Value |
|---|---|
| Deep Navy | `#17324D` |
| Healthcare Blue | `#2563EB` |
| Teal | `#0D9488` |

**Background**
| Token | Value |
|---|---|
| Main background | `#F7F9FC` |
| Card background | `#FFFFFF` |
| Secondary background | `#EFF4F8` |

**Text**
| Token | Value |
|---|---|
| Primary text | `#172B4D` |
| Secondary text | `#64748B` |
| Muted text | `#94A3B8` |

**Status**
| Token | Value |
|---|---|
| Success | `#16A34A` |
| Warning | `#D97706` |
| Error | `#DC2626` |

Use colors consistently.

### Typography

Use Inter or a similar modern sans-serif font.

| Level | Size |
|---|---|
| Page headings | 24–30px |
| Section headings | 18–22px |
| Body text | 14–16px |
| Small labels | 12–13px |

### UI Elements

- Rounded cards: 12–16px border radius.
- Subtle shadows.
- Light borders.
- Consistent spacing.
- Clear visual hierarchy.
- Minimal gradients.
- Smooth hover transitions.
- Consistent button styles.
- Lucide icons.

Avoid excessive animations and unnecessary decoration.

---

## 3. Application Layout

### Patient Dashboard Layout

**Desktop:**
- Left sidebar for navigation.
- Top header with page title and profile.
- Main content area.
- Responsive cards and tables.

**Sidebar navigation:**
1. Overview
2. Upload / Scan
3. Medical History
4. AI Assistant
5. Share Records
6. Profile
7. Settings

**Top header:**
- Current page title.
- Search.
- Notifications.
- Profile menu.

**Mobile:**
- Collapsible sidebar or mobile navigation.
- Responsive cards.
- Full-width content.
- Touch-friendly buttons.

---

## 4. Landing Page

### Hero Section

**Heading:**
> "Your Medical Records. Smarter, Simpler, Secure."

**Subheading:**
> "One intelligent platform to understand your prescriptions, organize medical reports, and securely access your complete medical history."

**Primary CTA:** "Get Started"

**Secondary CTA:** "Explore Features"

**Hero visual:**
Show a realistic healthcare dashboard preview containing:
- Prescription document.
- AI-extracted medicine information.
- Medical history timeline.
- Secure QR sharing preview.

### Features Section

Display four main feature cards:

1. **AI Prescription Understanding** — Understand printed and handwritten prescriptions.
2. **Smart Medical Reports** — Convert complex medical reports into easy-to-understand summaries.
3. **Complete Medical History** — Keep medical records organized in one place.
4. **Secure QR Sharing** — Share selected medical records with authorized doctors.

### How It Works

Show three steps:

1. Upload or Scan
2. AI Understands
3. Store and Share

### Footer

Include: About · Features · Privacy · Contact · Login

---

## 5. Authentication Pages

Create clean login and registration pages.

**Login fields:**
- Email
- Password

**Registration fields:**
- Full name
- Email
- Password
- Confirm password
- Account type: Patient or Doctor

**Design:**
- Centered authentication card.
- Healthcare branding.
- Clear validation messages.
- Password visibility toggle.
- Responsive layout.

---

## 6. Patient Dashboard

### Welcome Section

> "Good morning, [Patient Name]"

Subtitle: "Your medical records, organized in one place."

### Summary Cards

Display (values from actual database data):

1. Total Medical Records
2. Prescriptions
3. Medical Reports
4. Shared Records

### Quick Actions

Four prominent action cards:

- Upload Medical Document
- Scan Prescription
- View Medical History
- Share Records

### Recent Medical Records

Table or list displaying:

| Column | Notes |
|---|---|
| Document name | |
| Category | |
| Upload date | |
| AI processing status | |
| Verification status | |
| View action | |

### Recent Activity

Show recent actions such as:
- Prescription uploaded.
- Report analyzed.
- Medical information verified.
- QR access created.

---

## 7. Upload / Scan Page

This page should be visually important because document processing is a core feature.

### Upload Interface

Large drag-and-drop upload area displaying:

> "Upload your medical document"
> "Supported formats: JPG, JPEG, PNG, PDF"

Actions:
- Browse Files
- Scan Using Camera

### Document Category

Allow the patient to select:
- Prescription
- Blood Report
- X-ray Report
- Discharge Summary
- Other

### Processing Interface

After upload, show a clear processing sequence:

1. Uploading Document
2. Improving Image Quality
3. Extracting Text
4. Understanding Medical Information
5. Preparing Results

Display actual processing states from the backend rather than simulated progress.

---

## 8. AI Prescription Verification Page

This is the most important page in the application.

Use a **two-column layout**.

### Left Column: Original Document

- Show the uploaded prescription.
- Allow zooming.
- Allow opening the original document.
- Display the document name and date.

### Right Column: AI Extracted Information

Display:
- Doctor name.
- Patient name.
- Prescription date.
- Diagnosis, if available.
- Medicines.

Each medicine should appear in a separate card:

```
Medicine: Paracetamol
Dosage: 500 mg
Frequency: Twice daily
Duration: 3 days
Instructions: After food
```

### Verification UI

Every extracted field should have a verification status badge:

| Badge | Meaning |
|---|---|
| 🟢 Green | Verified |
| 🟡 Amber | Needs Review |
| ⚪ Grey | Not Available |

Allow the user to:
- Edit extracted information.
- Confirm individual fields.
- Confirm the complete prescription.
- Save corrections.

Uncertain medicine names and dosages must be prominently highlighted.

Do not display uncertain data as confirmed medical instructions.

---

## 9. Medical Report Analysis Page

Use a document viewer alongside an AI analysis panel.

### Report Overview

Display:
- Report name.
- Report category.
- Report date.
- Processing status.

### Extracted Values

Structured table:

| Test | Result | Unit | Reference Range |
|---|---|---|---|
| Hemoglobin | Extracted value | g/dL | If available |
| Glucose | Extracted value | mg/dL | If available |
| Cholesterol | Extracted value | mg/dL | If available |

Use actual extracted values, never placeholder medical conclusions.

### AI Explanation

Section titled: **"Understand Your Report"**

Show:
- Simple explanations of test values.
- Values marked abnormal in the original report.
- Important observations.
- Source information.

Include a clear disclaimer that AI explanations are informational and not a medical diagnosis.

---

## 10. Medical History Page

Chronological medical timeline.

### Filters

- All Records
- Prescriptions
- Blood Reports
- X-ray Reports
- Discharge Summaries
- Date range
- Search by document name
- Search by extracted content

### Timeline Design

Each record displays:

- Document title.
- Category icon.
- Date.
- Short description.
- AI processing status.
- Verification status.
- View Details action.

Selecting a record opens its details page showing:
- Original document.
- Extracted text.
- Structured medical information.
- AI explanation.
- Verification history.

---

## 11. QR Sharing Page

Dedicated secure record-sharing interface with four steps.

### Step 1: Select Records

List of medical records with checkboxes. Patients select exactly which records to share.

### Step 2: Configure Access

Allow the patient to configure:
- Expiration period.
- Access permissions.
- Selected documents.

### Step 3: Generate QR

Prominent QR code display after successful generation:

- QR code.
- Copy secure link action.
- Expiry date.
- Sharing status.
- Revoke access button.

### Step 4: Active Shares

Table of existing shares:

| Column | Notes |
|---|---|
| Created date | |
| Expiry date | |
| Shared documents count | |
| Access status | |
| Revoke action | |

Never display private medical information on the public QR landing page before token validation.

---

## 12. Doctor Dashboard

### Overview

Display:
- Recently accessed authorized records.
- Active shared sessions.
- Recent activity.

### QR Scanner

Dedicated QR scanning interface:
- Camera-based QR scanner.
- Manual secure link/token entry as a fallback.
- Clear success and failure states.

### Authorized Patient Records

After validating a QR token, display:
- Patient name, if shared.
- Shared medical records.
- Prescriptions.
- Medical reports.
- Medical history within the authorized scope.

Each record opens a detailed view.

The doctor must never be able to browse unrelated patient records.

---

## 13. AI Medical Assistant Page

Modern conversational interface.

### Header

> "AI Medical Assistant"

Subtitle: "Ask questions about your medical records."

### Example Questions

- Summarize my latest medical report.
- What medicines were mentioned in my last prescription?
- Show my previous blood reports.
- Compare my available test results over time.

### Chat Features

- Message bubbles.
- Loading indicator.
- Suggested questions.
- Source document references.
- Error handling.
- Clear conversation action.

The assistant answers only using available and authorized medical information.

Display a medical disclaimer.

---

## 14. Component Architecture

Suggested reusable components:

| Component | Purpose |
|---|---|
| AppLayout | Shared page shell |
| PatientSidebar | Patient navigation |
| DoctorSidebar | Doctor navigation |
| Header | Top bar with search and profile |
| SummaryCard | Dashboard stat cards |
| DocumentCard | Record listing card |
| DocumentUploader | Drag-and-drop uploader |
| CameraScanner | Camera capture |
| DocumentViewer | Original document display |
| ProcessingStatus | Upload/AI progress states |
| MedicineCard | Per-medicine extracted info |
| VerificationBadge | Field confidence indicator |
| MedicalTimeline | Chronological record list |
| ReportAnalysis | Report values and explanation |
| QRCodeDisplay | QR code output |
| QRScanner | Camera-based QR reader |
| ChatInterface | AI assistant conversation |
| ChatMessage | Individual message bubble |
| EmptyState | No-records placeholder |
| LoadingSpinner | Loading indicator |
| ConfirmationModal | Destructive action confirmation |
| ErrorMessage | Error display |

Keep components reusable and avoid unnecessarily large React components.

---

## 15. UX Requirements

- The interface must be responsive.
- Navigation must be intuitive.
- Use consistent spacing.
- Show loading indicators during API operations.
- Provide clear success and error messages.
- Confirm destructive actions.
- Use accessible labels and keyboard navigation.
- Use realistic synthetic medical records for demonstrations.
- Never use fake AI processing results as real extracted information.
- Show the original document alongside AI-generated information wherever possible.
- Make uncertain medical information visually distinguishable.

---

## 16. Final Design Goal

The finished product should look and behave like a professional AI healthcare SaaS platform.

**Most important design priorities:**

1. AI prescription understanding should be the visual and functional highlight.
2. Medical history should be easy to navigate.
3. QR sharing should be simple but secure.
4. Doctors should have a focused interface for accessing authorized records.
5. The entire application should feel consistent, modern and trustworthy.
