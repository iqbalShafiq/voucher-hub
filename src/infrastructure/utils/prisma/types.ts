export interface ErrorResponse {
	status: 400 | 404 | 500;
	data?: never;
	message: string;
	code: string;
	details?: unknown;
}

export type PrismaResponse<T> = {
	status: number;
	message?: string;
	code?: string;
	details?: unknown;
} & (
	| {
			status: 200;
			data: T | null;
			message?: never;
			code?: never;
			details?: never;
	  }
	| {
			status: 400 | 404 | 500;
			data?: never;
			message: string;
			code: string;
			details?: unknown;
	  }
);
