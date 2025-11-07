import { NoteSummary, Citation, SocialNeed, SocialNeedType, SubstanceUseStatus } from '../types/api';

// Transform the static JSON data format to match the expected NoteSummary interface
export function transformStaticDataToNoteSummary(data: any): NoteSummary {
  const createCitation = (evidence: any): Citation => {
    // Handle both old string format and new citation object format
    if (typeof evidence === 'string') {
      return {
        note_id: 1,
        quote: evidence
      };
    }
    // New format: evidence is already a citation object
    return {
      note_id: evidence.note_id,
      quote: evidence.quote
    };
  };

  const summary = data.summary;

  // Create identified needs from social_needs_assessment
  const identifiedNeeds: SocialNeed[] = [];
  
  if (summary.social_needs_assessment) {
    const socialNeeds = summary.social_needs_assessment;
    
    // Add mental health if present
    if (socialNeeds.mental_health) {
      identifiedNeeds.push({
        social_need_type: SocialNeedType.MENTAL_HEALTH,
        description: socialNeeds.mental_health.summary,
        citation: createCitation(socialNeeds.mental_health.evidence),
        previous_actions: [],
        current_actions: [],
        planned_actions: []
      });
    }

    // Add transportation as general need
    if (socialNeeds.transportation) {
      identifiedNeeds.push({
        social_need_type: SocialNeedType.HOUSING, // Using housing as closest match
        description: "Transportation",
        citation: socialNeeds.transportation.evidence, // Use the transportation evidence citation
        previous_actions: [],
        current_actions: [
          {
            description: socialNeeds.transportation.summary,
            citation: createCitation(socialNeeds.transportation.evidence),
            resources: []
          }
        ],
        planned_actions: []
      });
    }

    // Add safety concerns
    if (socialNeeds.safety) {
      identifiedNeeds.push({
        social_need_type: SocialNeedType.HOUSING,
        description: `Safety: ${socialNeeds.safety.summary}`,
        citation: createCitation(socialNeeds.safety.evidence),
        previous_actions: [],
        current_actions: [],
        planned_actions: []
      });
    }

    // Add food insecurity
    if (socialNeeds.food_insecurity) {
      identifiedNeeds.push({
        social_need_type: SocialNeedType.FOOD_INSECURITY,
        description: socialNeeds.food_insecurity.summary,
        citation: createCitation(socialNeeds.food_insecurity.evidence),
        previous_actions: [],
        current_actions: [],
        planned_actions: []
      });
    }

    // Add tobacco use
    if (socialNeeds.tobacco_use) {
      identifiedNeeds.push({
        social_need_type: SocialNeedType.TOBACCO_USE,
        description: socialNeeds.tobacco_use.summary,
        citation: createCitation(socialNeeds.tobacco_use.evidence),
        previous_actions: [],
        current_actions: [],
        planned_actions: []
      });
    }

    // Add alcohol use
    if (socialNeeds.alcohol_use) {
      identifiedNeeds.push({
        social_need_type: SocialNeedType.ALOCHOL_USE,
        description: socialNeeds.alcohol_use.summary,
        citation: createCitation(socialNeeds.alcohol_use.evidence),
        previous_actions: [],
        current_actions: [],
        planned_actions: []
      });
    }
  }

  return {
    identified_needs: identifiedNeeds,
    
    // Housing situation - transform from housing section
    housing_situation: summary.social_needs_assessment?.housing ? {
      summary: summary.social_needs_assessment.housing.summary,
      citations: [createCitation(summary.social_needs_assessment.housing.evidence)]
    } : undefined,

    // Reason for admission
    reason_for_admission: summary.reason_for_admission ? {
      reason: summary.reason_for_admission.summary,
      citation: createCitation(summary.reason_for_admission.evidence)
    } : undefined,

    // One liner
    one_liner: summary.one_liner ? {
      summary: summary.one_liner.summary,
      citation: createCitation(summary.one_liner.evidence)
    } : undefined,

    // Discharge - from high_priority.discharge
    discharge: summary.high_priority?.discharge ? {
      summary: summary.high_priority.discharge.summary,
      details: summary.high_priority.discharge.details,
      link_to_prefilled_ihss_form: summary.high_priority.discharge.link_to_prefilled_ihss_form,
      citation: createCitation(summary.high_priority.discharge.evidence)
    } : undefined,

    // dx_for_encounter - removed
    dx_for_encounter: undefined,

    // Therapy - empty for now but could be populated from other sections
    therapy: [],

    // Patient contacts
    patient_contacts: summary.resources?.patient_contacts?.map((contact: any) => ({
      name: contact.name,
      relation: contact.relation,
      contact_info: contact.contact_info,
      citation: createCitation(contact.evidence)
    })) || [],

    // Support at home - from high_priority.discharge
    support_at_home: summary.high_priority?.discharge ? {
      summary: summary.high_priority.discharge.summary,
      citation: createCitation(summary.high_priority.discharge.evidence)
    } : undefined,

    // Substance use
    substance_use: summary.social_needs_assessment?.substance_use ? {
      status: SubstanceUseStatus.NO_USE, // Default based on the evidence
      summary: summary.social_needs_assessment.substance_use.summary,
      citation: createCitation(summary.social_needs_assessment.substance_use.evidence)
    } : undefined,

    // Severe medical conditions
    severe_med_cond: summary.medical_assessment?.severe_medical_conditions ? [{
      diagnosis: summary.medical_assessment.severe_medical_conditions.summary,
      citation: createCitation(summary.medical_assessment.severe_medical_conditions.evidence)
    }] : [],

    // ED visits - empty for now
    ed_visits: undefined,

    // Psych hospital - empty for now  
    psych_hospital: undefined,

    // DME - from high_priority.diagnostics
    dme: summary.high_priority?.diagnostics ? Object.entries(summary.high_priority.diagnostics).map(([key, value]: [string, any]) => ({
      device_type: key.replace(/_/g, ' ').toUpperCase(),
      summary: value.summary,
      citation: createCitation(value.evidence)
    })) : []
  };
}