export interface Result {
  success: boolean;
  message: string;
  validationErrors?: Record<string, string[]>;
}

export interface DataResult<T> extends Result {
  data: T;
}
