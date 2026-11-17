/**
 * mockData.js
 * Centralised synthetic data used across all UI pages during development.
 * Replace individual fields with real API data in later phases.
 * All patient names, doctor names, and report values are synthetic.
 */

export const MOCK_USER = {
  id: 'usr_demo_001',
  full_name: 'Arjun Mehta',
  email: 'arjun.mehta@example.com',
  phone: '+91 98765 43210',
  role: 'patient',
  date_of_birth: '1990-03-15',
  blood_group: 'O+',
  address: '24, Vasant Vihar, New Delhi - 110057',
  created_at: '2024-01-10T08:30:00Z',
};

export const DOCUMENT_TYPES = {
  prescription: { label: 'Prescription', color: '#2563eb', bg: '#eff6ff' },
  blood_report:  { label: 'Blood Report', color: '#0d9488', bg: '#f0fdfa' },
  xray:          { label: 'X-Ray',        color: '#7c3aed', bg: '#f5f3ff' },
  discharge:     { label: 'Discharge',    color: '#d97706', bg: '#fffbeb' },
  other:         { label: 'Other',        color: '#64748b', bg: '#f8fafc' },
};

export const MOCK_RECORDS = [
  {
    id: 'rec_001',
    document_name: 'Dr. Kapoor — General Prescription',
    document_type: 'prescription',
    upload_date: '2026-11-10',
    doctor_name: 'Dr. Priya Kapoor',
    hospital: 'Apollo Clinic, Delhi',
    processing_status: 'completed',
    verification_status: 'verified',
    file_type: 'image/jpeg',
    size_kb: 324,
    notes: 'Routine check-up. Fever and cold.',
    extracted: {
      diagnosis: 'Acute Upper Respiratory Infection',
      medicines: [
        { name: 'Paracetamol', dosage: '500 mg', frequency: 'Twice daily', duration: '5 days', instructions: 'After food' },
        { name: 'Cetirizine', dosage: '10 mg', frequency: 'Once at night', duration: '5 days', instructions: 'Before sleep' },
        { name: 'Amoxicillin', dosage: '500 mg', frequency: 'Three times daily', duration: '7 days', instructions: 'After food', confidence: 'needs_review' },
      ],
    },
  },
  {
    id: 'rec_002',
    document_name: 'Complete Blood Count — Nov 2026',
    document_type: 'blood_report',
    upload_date: '2026-11-05',
    doctor_name: 'Dr. Ramesh Sharma',
    hospital: 'Fortis Lab, Delhi',
    processing_status: 'completed',
    verification_status: 'verified',
    file_type: 'application/pdf',
    size_kb: 512,
    notes: 'Annual health checkup blood work.',
    extracted: {
      tests: [
        { name: 'Hemoglobin', value: '13.2', unit: 'g/dL', reference: '13.0–17.5', status: 'normal' },
        { name: 'WBC Count', value: '10.8', unit: '×10³/µL', reference: '4.5–11.0', status: 'normal' },
        { name: 'Platelet Count', value: '148', unit: '×10³/µL', reference: '150–400', status: 'low' },
        { name: 'Blood Glucose (Fasting)', value: '104', unit: 'mg/dL', reference: '70–100', status: 'high' },
        { name: 'Total Cholesterol', value: '192', unit: 'mg/dL', reference: '< 200', status: 'normal' },
      ],
    },
  },
  {
    id: 'rec_003',
    document_name: 'Chest X-Ray Report',
    document_type: 'xray',
    upload_date: '2026-10-22',
    doctor_name: 'Dr. Anita Verma',
    hospital: 'Max Hospital, Delhi',
    processing_status: 'completed',
    verification_status: 'pending',
    file_type: 'image/png',
    size_kb: 1248,
    notes: 'Pre-operative workup.',
    extracted: { summary: 'Lungs are clear. No active consolidation or pleural effusion seen. Cardiac silhouette within normal limits.' },
  },
  {
    id: 'rec_004',
    document_name: 'Discharge Summary — Appendectomy',
    document_type: 'discharge',
    upload_date: '2026-09-18',
    doctor_name: 'Dr. Suresh Kumar',
    hospital: 'AIIMS, New Delhi',
    processing_status: 'completed',
    verification_status: 'verified',
    file_type: 'application/pdf',
    size_kb: 876,
    notes: 'Laparoscopic appendectomy. 3-day stay.',
    extracted: { summary: 'Patient admitted with acute appendicitis. Underwent laparoscopic appendectomy. Post-operative recovery uneventful. Discharged in stable condition.' },
  },
  {
    id: 'rec_005',
    document_name: 'Thyroid Function Test',
    document_type: 'blood_report',
    upload_date: '2026-08-14',
    doctor_name: 'Dr. Ramesh Sharma',
    hospital: 'Fortis Lab, Delhi',
    processing_status: 'completed',
    verification_status: 'verified',
    file_type: 'application/pdf',
    size_kb: 290,
    notes: 'Follow-up for hypothyroid monitoring.',
    extracted: {
      tests: [
        { name: 'TSH', value: '3.4', unit: 'mIU/L', reference: '0.4–4.0', status: 'normal' },
        { name: 'T3', value: '1.1', unit: 'ng/mL', reference: '0.8–2.0', status: 'normal' },
        { name: 'T4', value: '7.8', unit: 'µg/dL', reference: '5.0–12.0', status: 'normal' },
      ],
    },
  },
  {
    id: 'rec_006',
    document_name: 'Dr. Mehta — Follow-up Prescription',
    document_type: 'prescription',
    upload_date: '2026-07-30',
    doctor_name: 'Dr. Rahul Mehta',
    hospital: 'City Clinic, Noida',
    processing_status: 'completed',
    verification_status: 'verified',
    file_type: 'image/jpeg',
    size_kb: 215,
    notes: 'Post-surgery follow-up.',
    extracted: {
      diagnosis: 'Post-operative care',
      medicines: [
        { name: 'Pantoprazole', dosage: '40 mg', frequency: 'Once daily', duration: '14 days', instructions: 'Before breakfast' },
        { name: 'Metronidazole', dosage: '400 mg', frequency: 'Twice daily', duration: '7 days', instructions: 'After food' },
      ],
    },
  },
];

export const MOCK_ACTIVITY = [
  { id: 'act_001', type: 'upload',   message: 'Prescription uploaded',         record_id: 'rec_001', time: '2026-11-10T14:22:00Z' },
  { id: 'act_002', type: 'ai',       message: 'AI extraction completed',        record_id: 'rec_001', time: '2026-11-10T14:22:45Z' },
  { id: 'act_003', type: 'verify',   message: 'Prescription verified',          record_id: 'rec_001', time: '2026-11-10T14:35:00Z' },
  { id: 'act_004', type: 'upload',   message: 'Blood report uploaded',          record_id: 'rec_002', time: '2026-11-05T10:00:00Z' },
  { id: 'act_005', type: 'ai',       message: 'Report analysis completed',      record_id: 'rec_002', time: '2026-11-05T10:01:30Z' },
  { id: 'act_006', type: 'share',    message: 'QR access link created',         record_id: 'rec_002', time: '2026-11-06T09:15:00Z' },
];

export const MOCK_STATS = {
  total_records: 6,
  prescriptions: 2,
  medical_reports: 4,
  shared_records: 1,
};
