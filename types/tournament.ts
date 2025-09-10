/**
 * Tournament and Participant type definitions
 * Used throughout the tournament management system
 */

export interface Tournament {
  id: string;
  name: string;
  date: string;
  status: 'upcoming' | 'active' | 'completed';
  participant_count: number;
  description?: string;
  location?: string;
  organizer?: string;
  registration_deadline?: string;
  max_participants?: number;
  prize_structure?: string;
  rules?: string;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  registration_date: string;
  tournament_id: string;
  status: 'registered' | 'confirmed' | 'cancelled';
  skb_id?: string;
  phone?: string;
  belt_level?: string;
  age_category?: string;
  weight_category?: string;
  created_at: string;
  updated_at: string;
}

export interface TournamentFilters {
  status?: Tournament['status'];
  search?: string;
}

export interface ParticipantFilters {
  status?: Participant['status'];
  search?: string;
  belt_level?: string;
  age_category?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}