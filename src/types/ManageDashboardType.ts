export interface LastScanListType {
  patientName: string;
  patientHealthID: string;
  patientId: string;
  woundProfileId: string;
  woundProfileNo: string;
  woundName: string;
  latestUploaded: string;
  facilityId: string;
  profilePicUrl: string;
}

export interface DashboardScanCountType {
  totalProviders: number;
  totalStaffMembers: number;
  activePatients: number;
  inactivePatients: number;
  totalActivePatientsPerYear: number;
  totalScanUploadedCount: number;
}
