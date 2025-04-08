export interface Message {
  assistant: string;
  lead: string;
  sentTime: string;
  replyTime: string
  reply_status: string | null;
}

export interface Lead {
  id: string;
  email: string;
  name: string;
  details?: string;
  information?: string;
  status: LeadStatus;
  first_contacted_date: string;
  booked_date?: string;
  messages?: Message[];
}
export enum LeadStatus {
    NEW = 'new',
    CONTACTED = 'contacted',
    BOOKED = 'booked',
    STOPPED = 'stopped',
}
