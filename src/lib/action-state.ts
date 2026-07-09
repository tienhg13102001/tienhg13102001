export type ActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  timestamp?: number;
};

export const emptyState: ActionState = {};
