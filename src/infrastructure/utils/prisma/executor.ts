import {
	PrismaClientKnownRequestError,
	PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import {
	handleKnownError,
	handleUnknownError,
	handleValidationError,
} from "./errorHandler";
import StatusCode from "./statusCode";
import type { PrismaResponse } from "./types";

/**
 * Handles Prisma errors and returns a response object
 */
export const prismaSafeCall = {
	/**
	 * Wraps a Prisma operation and handles any errors that occur
	 * @param operation - The Prisma operation to execute
	 * @returns A promise that resolves to a PrismaResponse
	 */
	async execute<T>(
		operation: () => Promise<T | null>,
	): Promise<PrismaResponse<T | null>> {
		try {
			const data = await operation();

			// If the operation returned null, return a 404 response
			if (data === null) {
				return {
					status: StatusCode.NOT_FOUND,
					message: "Record not found",
					data: undefined,
					code: "NOT_FOUND",
				};
			}

			// Otherwise, return a 200 response with the data
			return {
				status: 200,
				data,
			};
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				return handleKnownError(error);
			}
			if (error instanceof PrismaClientValidationError) {
				return handleValidationError(error);
			}
			return handleUnknownError(error);
		}
	},
};
