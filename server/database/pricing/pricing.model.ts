export class Pricing {
  custom_branding: boolean;
  email_confirmation: boolean;
  recordings: Record<string, any>;
  support_integration: boolean;
  integrations: string;

  constructor(
    custom_branding: boolean,
    email_confirmation: boolean,
    recordings: Record<string, any>,
    support_integration: boolean,
    integrations: string,
  ) {
    this.custom_branding = custom_branding;
    this.email_confirmation = email_confirmation;
    this.recordings = recordings;
    this.support_integration = support_integration;
    this.integrations = integrations;
  }
}

export const collection = 'pricing';

export const converter: FirebaseFirestore.FirestoreDataConverter<Pricing> = {
  toFirestore(pricing: Pricing): FirebaseFirestore.DocumentData {
    return {
      custom_branding: pricing.custom_branding,
      email_confirmation: pricing.email_confirmation,
      recordings: pricing.recordings,
      support_integration: pricing.support_integration,
      integrations: pricing.integrations,
    };
  },

  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
    const {
      custom_branding,
      email_confirmation,
      recordings,
      support_integration,
      integrations,
    } = snapshot.data();

    return new Pricing(
      custom_branding,
      email_confirmation,
      recordings,
      support_integration,
      integrations,
    );
  },
};
