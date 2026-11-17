# Smart Medical Record Management System
## Software Requirements Specification (SRS)

---

## 1. Project Overview

Build an AI-powered Smart Medical Record Management System that allows patients to digitally store, understand, organize, and securely share their medical records.

The application should use OCR and AI to extract meaningful information from medical documents, including printed and handwritten prescriptions.

It should not behave like a simple file-storage application. AI-powered medical document understanding is the core functionality.

---

## 2. Problem Statement

Patients often face the following problems:

- Medical prescriptions are handwritten and difficult to understand.
- Medical reports are difficult for ordinary people to interpret.
- Physical medical documents can get lost or damaged.
- Patients have medical records scattered across different hospitals and clinics.
- Doctors may not have access to a patient's previous medical history.
- Patients have difficulty sharing their medical records quickly during emergencies.

---

## 3. Proposed Solution

Develop a centralized digital healthcare platform that:

1. Allows patients to upload or scan medical documents.
2. Uses OCR and AI to understand medical documents.
3. Extracts important information from prescriptions and reports.
4. Organizes medical records into categories.
5. Maintains a chronological medical history.
6. Generates QR codes for securely sharing selected medical records.
7. Allows authorized doctors to access shared records.
8. Provides AI-generated explanations of medical documents.

---

## 4. User Roles

### A. Patient

Patients can:

- Register and log in.
- Manage their profile.
- Upload medical documents.
- Scan prescriptions using a camera.
- View AI-extracted information.
- Verify and correct extracted information.
- View complete medical history.
- Search and filter medical records.
- Generate QR codes for sharing records.
- Manage QR access permissions.
- Revoke shared access.

### B. Doctor

Doctors can:

- Register and log in.
- Access records shared with them by patients.
- Scan or enter a patient's QR code.
- View authorized medical documents.
- View AI-extracted prescription information.
- View previous medical history included in the shared access.
- Read AI-generated report summaries.
- Access original uploaded documents.

Doctors must not be able to access private patient records without authorization.

---

## 5. Core Features

### Feature 1: Authentication

- Patient and doctor registration.
- Login and logout.
- Secure authentication using Supabase Auth.
- Role-based access control.
- Protected application routes.

### Feature 2: Medical Document Upload

Support the following formats:

- JPG
- JPEG
- PNG
- PDF

Supported medical document categories:

- Doctor prescriptions.
- Blood test reports.
- X-ray reports.
- Discharge summaries.
- Other medical documents.

Users should be able to upload files or capture images using their device camera.

Preserve the original uploaded document.

### Feature 3: AI Prescription Understanding

This is the primary feature of the application.

The system should:

1. Accept a prescription image or PDF.
2. Preprocess the document for better readability.
3. Detect and extract printed text.
4. Analyze handwritten medical text using a handwriting-capable vision model.
5. Identify important medical information.
6. Convert extracted information into structured data.
7. Display the extracted information for user verification.

Information to extract:

- Patient name (when available).
- Doctor name (when available).
- Prescription date.
- Medicine name.
- Dosage.
- Frequency.
- Duration.
- Instructions.
- Diagnosis (when available).

Example structured output:

```
Medicine: Paracetamol
Dosage: 500 mg
Frequency: Twice daily
Duration: 3 days
```

**Important:**
- Never invent missing medical information.
- Mark uncertain or unreadable text as "Needs Verification".
- Never silently confirm an unclear medicine name or dosage.
- Require user or doctor verification before treating extracted prescription details as confirmed.
- Do not generate medical instructions or recommend medication changes.

### Feature 4: AI Medical Report Analysis

The system should analyze uploaded medical reports and provide:

- Report category.
- Test names.
- Extracted values.
- Units.
- Reference ranges when present.
- Abnormal values as marked in the source report.
- Simple-language explanations.
- Important observations.

The AI should distinguish between information directly extracted from the report and AI-generated explanations.

It must not diagnose diseases or replace professional medical advice.

### Feature 5: Medical History

Maintain a chronological history of uploaded medical documents.

Users should be able to:

- View all previous records.
- View records by category.
- Filter records by date.
- Search by document name or extracted content.
- Open the original document.
- View AI-extracted information.
- View verification status.

### Feature 6: QR Code Medical Record Sharing

Patients should be able to securely share selected medical records using a QR code.

Workflow:

1. Patient selects medical records.
2. Patient clicks Generate QR.
3. System generates a secure access link.
4. System generates a QR code.
5. Doctor scans the QR code.
6. Doctor is shown only the records authorized by the patient.

Security requirements:

- QR access must use an unpredictable secure token.
- QR access must be revocable.
- QR access should have an expiry date.
- Patients must explicitly consent before sharing.
- Do not expose database IDs or public storage URLs as authorization tokens.
- Log record access.
- Never make all medical records publicly accessible.

### Feature 7: AI Medical Assistant

Provide an AI assistant that can answer questions about the patient's uploaded and authorized medical documents.

Example questions:

- What medicines were mentioned in my latest prescription?
- Summarize my latest blood report.
- What was my previous hemoglobin value?
- Show my medical records from the previous six months.

The assistant must:

- Answer using available patient records only.
- Clearly identify the document used as its source.
- State when information is unavailable.
- Avoid providing diagnoses or changing medication instructions.
- Respect the current user's permissions.

---

## 6. Main Application Pages

### Public Pages
- Landing Page
- Login Page
- Registration Page

### Patient Dashboard
- Dashboard Overview
- Upload / Scan Document
- AI Processing and Verification
- Medical History
- Medical Record Details
- AI Medical Assistant
- QR Sharing Management
- Patient Profile

### Doctor Dashboard
- Doctor Overview
- Scan QR Code
- Authorized Patient Records
- Medical Record Details
- Doctor Profile

---

## 7. Technology Stack

### Frontend
- React
- Vite
- React Router
- JavaScript
- CSS
- Lucide React icons

### Backend
- Node.js
- Express.js
- REST APIs

### Database and Authentication
- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Storage

### AI and Document Processing
- OpenCV for image preprocessing.
- Google Cloud Vision OCR or another suitable OCR provider.
- A handwriting-capable vision AI model for handwritten prescriptions.
- Gemini API or another suitable LLM for structured extraction and explanations.

### QR Code
- qrcode npm package.

---

## 8. Security Requirements

Medical information is sensitive.

Implement:

- Supabase Row Level Security (RLS).
- Role-based authorization.
- Secure backend API authentication.
- Private Supabase Storage buckets.
- Signed URLs for authorized document access.
- Server-side AI API calls.
- Environment variables for API keys.
- Secure QR tokens.
- Expiring and revocable QR access.
- Access logs.
- Input validation.
- File type and file size validation.

Never expose Supabase service-role keys or AI API keys in frontend code.

---

## 9. MVP Scope

The first working version must include:

1. Authentication.
2. Patient and doctor roles.
3. Patient dashboard.
4. Document upload.
5. OCR and AI prescription extraction.
6. Handwriting recognition with uncertainty handling.
7. Manual verification and correction.
8. Medical history.
9. AI report summaries.
10. QR code sharing.
11. Doctor's authorized record view.

The AI Medical Assistant can be implemented after the core features are working.

---

## 10. Important Development Rules

- Build a functional application, not just static UI screens.
- Use reusable React components.
- Keep frontend, backend, and database responsibilities separate.
- Use environment variables for secrets.
- Do not hardcode fake AI responses as actual AI functionality.
- Clearly identify demo data and synthetic medical records.
- Use synthetic patient information during development.
- Handle loading, error, empty, and success states.
- Preserve original medical documents.
- Make the application responsive.
- Do not claim the application is clinically validated or production-ready for real patient data.
