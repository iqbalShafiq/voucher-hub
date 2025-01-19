export interface ErrorResponse {
	status: number;
	message: string;
	code?: string;
	details?: unknown;
}

export interface SuccessResponse<T> {
	status: number;
	data: T;
}

export type PrismaResponse<T> = SuccessResponse<T | null> | ErrorResponse;
