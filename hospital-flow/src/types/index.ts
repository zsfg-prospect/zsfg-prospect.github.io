export interface ServiceCategory {
  answer: boolean | string;
  explanation: string;
  noteReference?: {
    noteId: string;
    noteTimestamp: string;
    noteText: string;
    relevantSnippet: string;
  };
}

export type CategoryKey = 
  | 'interpersonal_partner_violence'
  | 'tobacco_use'
  | 'food_insecurity'
  | 'substance_use'
  | 'alcohol_use'
  | 'depression'
  | 'transportation_needs'
  | 'employment'
  | 'housing';

export type CategorySection = {
  [K in CategoryKey]: ServiceCategory;
};

export interface SocialServicesData {
  has_connections: CategorySection;
  connected_service: CategorySection;
  barriers_to_service: CategorySection;
}

export interface Patient {
  id: string;
  name: string;
  summary?: SocialServicesData;
} 