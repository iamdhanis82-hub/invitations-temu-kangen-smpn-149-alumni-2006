export interface RSVPData {
  id: string;
  name: string;
  graduationYear: string;
  className: string;
  phone: string;
  status: 'hadir' | 'tidak_hadir' | 'ragu';
  attendeesCount: number;
  notes?: string;
  timestamp: string;
}

export interface GuestbookMessage {
  id: string;
  name: string;
  graduationYear: string;
  className: string;
  message: string;
  mood: 'nostalgia' | 'excited' | 'grateful' | 'miss_friends';
  timestamp: string;
  likes: number;
  avatarColor: string;
}

export interface CommitteeMember {
  role: string;
  name: string;
  phone: string;
  whatsapp: string;
  avatar: string;
  description: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  iconName: string;
}
