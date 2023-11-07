export class ROICalculation {
  amountOfInquiries: number;
  timeToSolution: number;
  costPerEmployee: number;
  amountOfAgents: number;
  productCategory: string;
  email: string;
  createdAt: number;

  constructor(
    amountOfInquiries: number,
    timeToSolution: number,
    costPerEmployee: number,
    amountOfAgents: number,
    productCategory: string,
    email: string,
    createdAt: number
  ) {
    this.amountOfInquiries = amountOfInquiries;
    this.timeToSolution = timeToSolution;
    this.costPerEmployee = costPerEmployee;
    this.amountOfAgents = amountOfAgents;
    this.productCategory = productCategory;
    this.email = email;
    this.createdAt = createdAt;
  }
}

export const collection = 'roicalculator';

export const converter: FirebaseFirestore.FirestoreDataConverter<ROICalculation> =
  {
    toFirestore(
      roicalculation: ROICalculation
    ): FirebaseFirestore.DocumentData {
      return {
        amount_of_inquiries: roicalculation.amountOfInquiries,
        time_to_solution: roicalculation.timeToSolution,
        cost_per_employee: roicalculation.costPerEmployee,
        amount_of_agents: roicalculation.amountOfAgents,
        product_category: roicalculation.productCategory,
        email: roicalculation.email,
        createdAt: roicalculation.createdAt,
      };
    },

    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
      const {
        amount_of_inquiries,
        time_to_solution,
        cost_per_employee,
        amount_of_agents,
        product_category,
        email,
        createdAt,
      } = snapshot.data();

      return new ROICalculation(
        amount_of_inquiries,
        time_to_solution,
        cost_per_employee,
        amount_of_agents,
        product_category,
        email,
        createdAt
      );
    },
  };
