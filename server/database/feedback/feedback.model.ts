export class Feedback {
  user: Record<string, any>;
  integration: Record<string, any>;
  feedback: string;
  createdAt: number;
  feedbackText?: string;

  constructor(
    user: Record<string, any>,
    integration: Record<string, any>,
    feedback: string,
    createdAt: number,
    feedbackText?: string
  ) {
    this.user = user;
    this.integration = integration;
    this.feedback = feedback;
    this.createdAt = createdAt;
    this.feedbackText = feedbackText;
  }
}

export const collection = 'feedback';

export const converter: FirebaseFirestore.FirestoreDataConverter<Feedback> = {
  toFirestore(feedback: Feedback): FirebaseFirestore.DocumentData {
    return {
      user: feedback.user,
      integration: feedback.integration,
      feedback: feedback.feedback,
      createdAt: feedback.createdAt,
      feedbackText: feedback.feedbackText,
    };
  },

  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
    const { user, integration, feedback, createdAt, feedbackText } =
      snapshot.data();

    return new Feedback(user, integration, feedback, createdAt, feedbackText);
  },
};
