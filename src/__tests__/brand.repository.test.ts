import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { Brand } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { CreateBrand } from "../infrastructure/entities/brand";
import { BrandRepository } from "../infrastructure/repositories/brand.repository";
import PrismaErrorCode from "../infrastructure/utils/prisma/prismaErrorCode";
import StatusCode from "../infrastructure/utils/prisma/statusCode";

const mockBrand: Brand = {
	id: "br1234567",
	name: "Test Brand",
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe("BrandRepository", () => {
	let brandRepository: BrandRepository;

	beforeEach(() => {
		brandRepository = new BrandRepository();
	});

	describe("getById", () => {
		test("should return brand when found", async () => {
			// Prepare mock data
			const mockFoundBrand: Brand = { ...mockBrand };

			// Setup mock implementation
			const mockFindUnique = mock<() => Promise<Brand>>(
				async () => mockFoundBrand,
			);

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					brand: {
						findUnique: mockFindUnique,
					},
				},
			}));

			// Execute the method
			const result = await brandRepository.getById("br1234567");

			// Assertions
			expect(result).toBeDefined();
			expect(result.status).toBe(200);
			expect(result).toHaveProperty("data");
			expect(result.data).toEqual(mockFoundBrand);

			// Verify specific properties
			expect(result?.data).toHaveProperty("id", "br1234567");
			expect(result?.data).toHaveProperty("name", "Test Brand");
		});

		test("should return not found when brand doesn't exist", async () => {
			// Setup mock implementation
			const mockFindUnique = mock<() => Promise<Brand | null>>(
				async () => null,
			);

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					brand: {
						findUnique: mockFindUnique,
					},
				},
			}));

			// Execute and assert
			const result = await brandRepository.getById("nonexistent");

			expect(result.status).toBe(StatusCode.NOT_FOUND);
			expect(result.message).toBe("Record not found");
			expect(result.data).toBeUndefined();
		});

		test("should handle unexpected errors", async () => {
			// Setup mock to throw error
			const mockFindUnique = mock<() => Promise<Brand>>(() => {
				throw new Error("Database error");
			});

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					brand: {
						findUnique: mockFindUnique,
					},
				},
			}));

			// Execute and assert
			const result = await brandRepository.getById("br1234567");

			expect(result.status).toBe(StatusCode.SERVER_ERROR);
			expect(result.message).toBe("An unexpected error occurred");
		});
	});

	describe("create", () => {
		test("should create brand successfully", async () => {
			// Prepare input data
			const newBrand: CreateBrand = {
				name: "New Brand",
			};

			// Prepare expected result
			const mockCreatedBrand: Brand = {
				...mockBrand,
				name: newBrand.name,
			};

			// Setup mock implementation
			const mockCreate = mock<() => Promise<Brand>>(
				async () => mockCreatedBrand,
			);

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					brand: {
						create: mockCreate,
					},
				},
			}));

			// Execute and assert
			const result = await brandRepository.create(newBrand);

			expect(result.status).toBe(200);
			expect(result.data).toBeDefined();
			expect(result.data?.name).toBe(newBrand.name);
		});

		test("should handle empty brand name", async () => {
			// Prepare input data with empty name
			const newBrand: CreateBrand = {
				name: "   ",
			};

			// Setup mock
			const mockCreate = mock<() => Promise<Brand>>(async () => mockBrand);

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					brand: {
						create: mockCreate,
					},
				},
			}));

			// Execute and assert
			const result = await brandRepository.create(newBrand);

			expect(result.status).toBe(StatusCode.BAD_REQUEST);
			expect(result.message).toBe("Brand name cannot be empty");
			expect(mockCreate).not.toHaveBeenCalled();
		});

		test("should handle duplicate brand name", async () => {
			// Prepare input data
			const newBrand: CreateBrand = {
				name: "Existing Brand",
			};

			// Setup mock to throw duplicate error
			const mockCreate = mock<() => Promise<Brand>>(() => {
				throw new PrismaClientKnownRequestError("Unique constraint failed", {
					code: PrismaErrorCode.DUPLICATE_ENTRY,
					clientVersion: "5.0.0",
					meta: { target: ["name"] },
				});
			});

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					brand: {
						create: mockCreate,
					},
				},
			}));

			// Execute and assert
			const result = await brandRepository.create(newBrand);

			expect(result.status).toBe(StatusCode.BAD_REQUEST);
			expect(result.message).toBe("Unique constraint failed");
		});

		test("should handle unexpected errors during creation", async () => {
			// Prepare input data
			const newBrand: CreateBrand = {
				name: "New Brand",
			};

			// Setup mock to throw unexpected error
			const mockCreate = mock<() => Promise<Brand>>(() => {
				throw new Error("Unexpected database error");
			});

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					brand: {
						create: mockCreate,
					},
				},
			}));

			// Execute and assert
			const result = await brandRepository.create(newBrand);

			expect(result.status).toBe(StatusCode.SERVER_ERROR);
			expect(result.message).toBe("An unexpected error occurred");
		});
	});
});
