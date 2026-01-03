export interface Bulletin {
  id: string;
  title: string;
  publishDate: string; // ISO Date string YYYY-MM-DD
  driveLink: string;
  summary?: string; // Optional AI generated summary
}

export interface BulletinFormData {
  title: string;
  publishDate: string;
  driveLink: string;
}
