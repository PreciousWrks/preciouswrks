export type Review = {
  name: string;
  role?: string;
  project?: string;
  rating?: number;
  text: string;
  date: string;
};

/**
 * Reviews submitted through /review arrive by email first.
 * Add one here only when the reviewer has given permission to publish
 * and the collaboration has been confirmed. Never add invented reviews.
 */
export const publishedReviews: Review[] = [];
