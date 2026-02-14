export interface ApiResponse<T> {
  statusCode: string;
  message: string;
  success: boolean;
  data: T;
}