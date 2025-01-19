import type {
	PrismaClientKnownRequestError,
	PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import PrismaErrorCode from "./prismaErrorCode";
import StatusCode from "./statusCode";
import type { ErrorResponse } from "./types";

export const handleKnownError = (
	error: PrismaClientKnownRequestError,
): ErrorResponse => {
	let status = StatusCode.SERVER_ERROR;
	let message = "Database error occurred";

	switch (error.code) {
		case PrismaErrorCode.DUPLICATE_ENTRY:
			status = StatusCode.BAD_REQUEST;
			message = `Duplicate entry for ${error.meta?.target as string[]}`;
			break;
		case PrismaErrorCode.INVALID_RELATION:
			status = StatusCode.BAD_REQUEST;
			message = "Invalid relation data provided";
			break;
		case PrismaErrorCode.INVALID_REFERENCE:
			status = StatusCode.BAD_REQUEST;
			message = "Invalid reference to related resource";
			break;
		case PrismaErrorCode.NOT_FOUND:
			status = StatusCode.NOT_FOUND;
			message = "Record not found";
			break;
	}

	return {
		status,
		message,
		code: error.code,
		details: error.meta,
	};
};

export const handleValidationError = (
	error: PrismaClientValidationError,
): ErrorResponse => {
	return {
		status: StatusCode.BAD_REQUEST,
		message: "Validation error: Invalid data provided",
		details: error.message,
	};
};

export const handleUnknownError = (error: unknown): ErrorResponse => {
	return {
		status: StatusCode.SERVER_ERROR,
		message: "An unexpected error occurred",
		details: error instanceof Error ? error.message : "Unknown error",
	};
};
