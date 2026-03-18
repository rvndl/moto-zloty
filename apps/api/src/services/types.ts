export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; statusCode: number; error: string };

export function ok<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

export function err(statusCode: number, error: string): ServiceResult<never> {
  return { success: false, statusCode, error };
}
