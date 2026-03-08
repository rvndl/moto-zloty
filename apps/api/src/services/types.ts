export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; statusCode: number; error: string };

export function ok<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

export function err<T>(statusCode: number, error: string): ServiceResult<T> {
  return { success: false, statusCode, error };
}
