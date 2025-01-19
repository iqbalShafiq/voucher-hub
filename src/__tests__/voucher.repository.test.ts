import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { Voucher } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { CreateVoucher } from "../infrastructure/entities/voucher";
import { VoucherRepository } from "../infrastructure/repositories/voucher.repository";
import StatusCode from "../infrastructure/utils/prisma/statusCode";

const mockVoucher: Voucher = {
	id: "vc1234567",
	brandId: "br1234567",
	name: "Test Voucher",
	description: "Test Description",
	pointCost: 100,
	isActive: true,
	validUntil: new Date("2025-12-31"),
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe("VoucherRepository", () => {
	let voucherRepository: VoucherRepository;

	beforeEach(() => {
		voucherRepository = new VoucherRepository();
	});

	describe("getById", () => {
		test("should return voucher when found", async () => {
			// Setup mock implementation
			const mockFindUnique = mock<() => Promise<Voucher>>(
				async () => mockVoucher,
			);

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					voucher: {
						findUnique: mockFindUnique,
					},
				},
			}));

			// Execute and assert
			const result = await voucherRepository.getById("vc1234567");

			expect(result.status).toBe(200);
			expect(result.data).toEqual(mockVoucher);
			expect(result?.data?.id).toBe("vc1234567");
			expect(result?.data?.name).toBe("Test Voucher");
			expect(result?.data?.pointCost).toBe(100);
		});

		test("should return not found when voucher doesn't exist", async () => {
			// Setup mock implementation
			const mockFindUnique = mock<() => Promise<Voucher | null>>(
				async () => null,
			);

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					voucher: {
						findUnique: mockFindUnique,
					},
				},
			}));

			const result = await voucherRepository.getById("nonexistent");

			expect(result.status).toBe(StatusCode.NOT_FOUND);
			expect(result.message).toBe("Record not found");
		});
	});

	describe("getByBrandId", () => {
		test("should return vouchers for specific brand", async () => {
			const mockVouchers = [mockVoucher, { ...mockVoucher, id: "vc7654321" }];

			// Setup mock implementation
			const mockFindMany = mock<() => Promise<Voucher[]>>(
				async () => mockVouchers,
			);

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					voucher: {
						findMany: mockFindMany,
					},
				},
			}));

			const result = await voucherRepository.getByBrandId("br1234567");

			expect(result.status).toBe(200);
			expect(result.data).toHaveLength(2);
			expect(result?.data?.[0]?.brandId).toBe("br1234567");
		});

		test("should return empty array when no vouchers found", async () => {
			// Setup mock implementation
			const mockFindMany = mock<() => Promise<Voucher[]>>(async () => []);

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					voucher: {
						findMany: mockFindMany,
					},
				},
			}));

			const result = await voucherRepository.getByBrandId("br1234567");

			expect(result.status).toBe(200);
			expect(result.data).toHaveLength(0);
		});
	});

	describe("create", () => {
		test("should create voucher successfully", async () => {
			const newVoucher: CreateVoucher = {
				brandId: "br1234567",
				name: "New Voucher",
				description: "New Description",
				pointCost: 150,
				validUntil: new Date("2025-12-31"),
			};

			// Setup mock implementation
			const mockCreate = mock<() => Promise<Voucher>>(async () => ({
				...mockVoucher,
				...newVoucher,
			}));

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					voucher: {
						create: mockCreate,
					},
				},
			}));

			const result = await voucherRepository.create(newVoucher);

			expect(result.status).toBe(200);
			expect(result?.data?.name).toBe(newVoucher.name);
			expect(result?.data?.pointCost).toBe(newVoucher.pointCost);
		});

		test("should reject empty voucher name", async () => {
			const invalidVoucher: CreateVoucher = {
				brandId: "br1234567",
				name: "   ",
				pointCost: 150,
				validUntil: new Date("2025-12-31"),
			};

			const mockCreate = mock<() => Promise<Voucher>>(async () => mockVoucher);

			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					voucher: {
						create: mockCreate,
					},
				},
			}));

			const result = await voucherRepository.create(invalidVoucher);

			expect(result.status).toBe(StatusCode.BAD_REQUEST);
			expect(result.message).toBe("Voucher name cannot be empty");
			expect(mockCreate).not.toHaveBeenCalled();
		});

		test("should reject non-positive point cost", async () => {
			const invalidVoucher: CreateVoucher = {
				brandId: "br1234567",
				name: "Test Voucher",
				pointCost: 0,
				validUntil: new Date("2025-12-31"),
			};

			const mockCreate = mock<() => Promise<Voucher>>(async () => mockVoucher);

			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					voucher: {
						create: mockCreate,
					},
				},
			}));

			const result = await voucherRepository.create(invalidVoucher);

			expect(result.status).toBe(StatusCode.BAD_REQUEST);
			expect(result.message).toBe("Point cost must be greater than zero");
			expect(mockCreate).not.toHaveBeenCalled();
		});

		test("should reject missing valid until date", async () => {
			const invalidVoucher: CreateVoucher = {
				brandId: "br1234567",
				name: "Test Voucher",
				pointCost: 100,
			};

			const mockCreate = mock<() => Promise<Voucher>>(async () => mockVoucher);

			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					voucher: {
						create: mockCreate,
					},
				},
			}));

			const result = await voucherRepository.create(invalidVoucher);

			expect(result.status).toBe(StatusCode.BAD_REQUEST);
			expect(result.message).toBe("Valid until date is required");
			expect(mockCreate).not.toHaveBeenCalled();
		});

		test("should handle foreign key constraint error", async () => {
			const newVoucher: CreateVoucher = {
				brandId: "nonexistent",
				name: "Test Voucher",
				pointCost: 100,
				validUntil: new Date("2025-12-31"),
			};

			const mockCreate = mock<() => Promise<Voucher>>(() => {
				throw new PrismaClientKnownRequestError(
					"Foreign key constraint failed",
					{
						code: "P2003",
						clientVersion: "5.0.0",
						meta: { field_name: "brandId" },
					},
				);
			});

			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					voucher: {
						create: mockCreate,
					},
				},
			}));

			const result = await voucherRepository.create(newVoucher);

			expect(result.status).toBe(StatusCode.BAD_REQUEST);
			expect(result.message).toContain("Foreign key constraint failed");
		});
	});
});
