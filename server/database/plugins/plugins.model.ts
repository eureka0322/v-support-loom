export class Plugins {
  description: string;
  displayText: string;
  customConfiguration: Record<string, Record<string, string | boolean>>;

  constructor(
    description: string,
    displayText: string,
    customConfiguration: Record<string, Record<string, string | boolean>>
  ) {
    this.description = description;
    this.displayText = displayText;
    this.customConfiguration = customConfiguration;
  }
}

export const collection = 'plugins';

export const converter: FirebaseFirestore.FirestoreDataConverter<Plugins> = {
  toFirestore(plugins: Plugins): FirebaseFirestore.DocumentData {
    return {
      description: plugins.description,
      displayText: plugins.displayText,
      customConfiguration: plugins.customConfiguration,
    };
  },

  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
    const { description, displayText, customConfiguration } = snapshot.data();

    return new Plugins(description, displayText, customConfiguration);
  },
};
