export interface PatientIdsResponse {
  patient_ids: number[];
}

export interface TimestampsResponse {
  timestamps: string[];
}

export interface Note {
  timestamp: string;
  note_text: string;
  type: string;
  clinical_service: string;
  note_id: string;
}

export enum BinaryStatus {
  YES = "yes",
  NO = "no"
}

export enum TimeStatus {
  COMPLETED = "completed",
  IN_PROGRESS = "in_progress",
  PLANNED = "planned"
}

export enum NeedStatus {
  RESOLVED = "resolved",
  ONGOING = "ongoing",
  NEW = "new"
}

export enum Priority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low"
}

export enum TherapyType {
  REHAB = "rehab",
  SPEECH = "speech",
  NUTRITION = "nutrition",
  LANGUAGE = "language"
}

export enum SubstanceUseStatus {
  UNKNOWN = "unknown",
  PAST = "past",
  CURRENT = "current",
  NO_USE = "no use"
}

export enum LivingArrangement {
  RENT_OR_OWN = "Rent or Own",
  RENT_WITH_SUPPORT = "Rent Unit with Support Services Onsite",
  JAIL_HOMELESS = "Residential Treatment / Jail - will exit homeless",
  LIVING_OUTSIDE = "Living Outside (Street / Vehicle / Makeshift)",
  TEMP = "Temporarily with Friend / Family",
  STABIL_ROOM = "Stabilization Room / Hotel / SRO",
  SHELTER = "Shelter / Navigation Center",
  SUPPORTIVE_HOUSING = "Permanent Supportive Housing",
  JAIL_HOUSED = "Residential Treatment / Jail - will exit housed",
  UNKNOWN = "Unknown"
}

export enum SocialNeedType {
  INTERPERSONAL_VIOLENCE = "interpersonal violence",
  TOBACCO_USE = "tobacco use",
  HOUSING = "housing",
  IMMIGRATION = "immigration",
  FOOD_INSECURITY = "food_insecurity",
  SUBSTANCE_USE = "substance use",
  ALOCHOL_USE = "alcohol use",
  MENTAL_HEALTH = "mental health"
}

export interface Citation {
  note_id: number;
  quote: string;
}

export interface Resource {
  name: string;
  date_of_connection?: string;
  barriers?: string;
  citation: Citation;
}

export interface Action {
  description: string;
  date?: string;
  outcome?: string;
  citation: Citation;
  resources: Resource[];
}

export interface SocialNeed {
  social_need_type: SocialNeedType;
  description: string;
  citation: Citation;
  previous_actions: Action[];
  current_actions: Action[];
  planned_actions: Action[];
  status?: NeedStatus;
  priority?: Priority;
}

export interface Housing {
  current_living_arrangement?: LivingArrangement;
  past_living_arrangement?: LivingArrangement;
  summary?: string;
  citations: Citation[];
}

export interface Consult {
  reason?: string;
  priority?: Priority;
  citation: Citation;
}

export interface Admission {
  reason?: string;
  citation?: Citation;
}

export interface OneLiner {
  summary?: string;
  citation?: Citation;
}

export interface Discharge {
  summary?: string;
  details?: string;
  link_to_prefilled_ihss_form?: string;
  citation?: Citation;
}

export interface EncounterDx {
  diagnosis?: string;
  citation?: Citation;
}

export interface Therapy {
  rehab_type: TherapyType;
  has_consult: BinaryStatus;
  summary: string;
  citation: Citation;
}

export interface PatientContact {
  name: string;
  contact_info?: string;
  relation?: string;
  citation: Citation;
}

export interface SupportAtHome {
  summary: string;
  citation: Citation;
}

export interface SubstanceUse {
  status: SubstanceUseStatus;
  summary: string;
  date_of_last_use?: string;
  on_methadone?: string;
  citation: Citation;
}

export interface SevereMedicalCondition {
  diagnosis: string;
  date_of_diagonsis?: string;
  citation: Citation;
}

export interface SummaryEDVisit {
  summary: string;
  citations: Citation[];
}

export interface SummaryPsychHosp {
  summary: string;
  citations: Citation[];
}

export interface DMEDevice {
  device_type: string;
  summary: string;
  citation: Citation;
}

export interface NoteSummary {
  identified_needs: SocialNeed[];
  housing_situation?: Housing;
  reason_for_consult?: Consult;
  reason_for_admission?: Admission;
  one_liner?: OneLiner;
  discharge?: Discharge;
  dx_for_encounter?: EncounterDx;
  therapy: Therapy[];
  patient_contacts: PatientContact[];
  support_at_home?: SupportAtHome;
  substance_use?: SubstanceUse;
  severe_med_cond: SevereMedicalCondition[];
  ed_visits?: SummaryEDVisit;
  psych_hospital?: SummaryPsychHosp;
  dme: DMEDevice[];
}

export interface SummaryResponse {
  summary: NoteSummary;
  notes: Note[];
}

export interface FormFieldValue {
  field_id: string;
  value?: string;
  citation?: Citation;
}

export interface FormFillingResponse {
  filled_fields: FormFieldValue[];
}

export interface FormField {
  field_id: string;
  name: string;
  type: string;
  required: boolean;
  options: string[];
  question?: string;
  answer?: string;
}

export interface FormData {
  id?: number;
  name: string;
  file_path: string;
  fields: FormField[];
  filled_fields?: FormFieldValue[];
}
