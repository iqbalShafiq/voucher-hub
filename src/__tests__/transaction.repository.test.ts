import { beforeEach, describe, expect, mock, test } from "bun:test";
import type {
	Customer,
	Transaction,
	TransactionDetail,
	TransactionStatus,
	Voucher,
} from "@prisma/client";
import type { CreateTransaction } from "../infrastructure/entities/transaction";
import { TransactionRepository } from "../infrastructure/repositories/transaction.repository";
import StatusCode from "../infrastructure/utils/prisma/statusCode";

const mockCustomer: Customer = {
	id: "customer123",
	email: "test@example.com",
	name: "Test Customer",
	pointBalance: 1000,
	createdAt: new Date(),
	updatedAt: new Date(),
};

const mockVoucher: Voucher = {
	id: "vouch123",
	brandId: "brand123",
	name: "Test Voucher",
	description: "Test Description",
	pointCost: 100,
	isActive: true,
	validUntil: new Date("2025-12-31"),
	createdAt: new Date(),
	updatedAt: new Date(),
};

const mockTransactionDetail: TransactionDetail = {
	id: "td123",
	transactionId: "trans123",
	voucherId: mockVoucher.id,
	quantity: 2,
	pointCost: mockVoucher.pointCost,
	createdAt: new Date(),
	updatedAt: new Date(),
};

const mockTransaction: Transaction & { details: TransactionDetail[] } = {
	id: "trans123",
	customerId: mockCustomer.id,
	totalPoints: 200,
	status: "COMPLETED" as TransactionStatus,
	createdAt: new Date(),
	updatedAt: new Date(),
	details: [mockTransactionDetail],
};

type TransactionClient = {
	customer: {
		findUnique: (params: { where: { id: string } }) => Promise<Customer | null>;
		update: (params: {
			where: { id: string };
			data: { pointBalance: { decrement: number } };
		}) => Promise<Customer>;
	};
	voucher: {
		findMany: (params: {
			where: {
				id: { in: string[] };
				isActive: boolean;
				validUntil: { gte: Date };
			};
		}) => Promise<Voucher[]>;
	};
	transaction: {
		create: (params: {
			data: {
				customerId: string;
				totalPoints: number;
				status: TransactionStatus;
				details: {
					create: {
						voucherId: string;
						quantity: number;
						pointCost: number;
					}[];
				};
			};
			include: { details: boolean };
		}) => Promise<Transaction & { details: TransactionDetail[] }>;
		update: (params: {
			where: { id: string };
			data: { status: TransactionStatus };
		}) => Promise<Transaction>;
	};
};

describe("TransactionRepository", () => {
	let transactionRepository: TransactionRepository;

	beforeEach(() => {
		transactionRepository = new TransactionRepository();
	});

	describe("getById", () => {
		test("should return transaction with details when found", async () => {
			// Setup mock implementation
			const mockFindUnique = mock<() => Promise<typeof mockTransaction>>(
				async () => mockTransaction,
			);

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					transaction: {
						findUnique: mockFindUnique,
					},
				},
			}));

			const result = await transactionRepository.getById("trans123");

			expect(result.status).toBe(200);
			expect(result?.data?.id).toBe("trans123");
			expect(result?.data?.details).toHaveLength(1);
			expect(result?.data?.totalPoints).toBe(200);

			// Additional assertions for details
			const detail = result?.data?.details?.[0];
			expect(detail).toEqual(mockTransactionDetail);
			expect(detail?.voucherId).toBe(mockVoucher.id);
			expect(detail?.quantity).toBe(2);
			expect(detail?.pointCost).toBe(mockVoucher.pointCost);
		});

		test("should return not found when transaction doesn't exist", async () => {
			// Setup mock implementation
			const mockFindUnique = mock<() => Promise<null>>(async () => null);

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					transaction: {
						findUnique: mockFindUnique,
					},
				},
			}));

			const result = await transactionRepository.getById("nonexistent");

			expect(result.status).toBe(StatusCode.NOT_FOUND);
			expect(result.message).toBe("Record not found");
		});
	});

	describe("create", () => {
		const createTransactionData: CreateTransaction = {
			customerId: mockCustomer.id,
			details: [
				{
					voucherId: mockVoucher.id,
					quantity: 2,
					pointCost: mockVoucher.pointCost,
				},
			],
		};

		test("should create transaction successfully", async () => {
			// Setup mock transaction client
			const mockTx: TransactionClient = {
				customer: {
					findUnique: mock<TransactionClient["customer"]["findUnique"]>(
						async () => mockCustomer,
					),
					update: mock<TransactionClient["customer"]["update"]>(async () => ({
						...mockCustomer,
						pointBalance: 800,
					})),
				},
				voucher: {
					findMany: mock<TransactionClient["voucher"]["findMany"]>(async () => [
						mockVoucher,
					]),
				},
				transaction: {
					create: mock<TransactionClient["transaction"]["create"]>(
						async () => ({ ...mockTransaction, status: "PENDING" }),
					),
					update: mock<TransactionClient["transaction"]["update"]>(
						async () => mockTransaction,
					),
				},
			};

			// Setup mock transaction
			const mockPrismaTransaction = mock<
				(
					callback: (
						tx: TransactionClient,
					) => Promise<Transaction & { details: TransactionDetail[] }>,
				) => Promise<Transaction & { details: TransactionDetail[] }>
			>(async (callback) => callback(mockTx));

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					$transaction: mockPrismaTransaction,
				},
			}));

			const result = await transactionRepository.create(createTransactionData);

			expect(result.status).toBe(200);
			expect(result?.data?.status).toBe("COMPLETED");
			expect(result?.data?.totalPoints).toBe(200);
			expect(result?.data?.details).toHaveLength(1);
		});

		test("should fail when customer not found", async () => {
			// Setup mock transaction client
			const mockTx: Pick<TransactionClient, "customer"> = {
				customer: {
					findUnique: mock<TransactionClient["customer"]["findUnique"]>(
						async () => null,
					),
					update: (): Promise<{
						name: string;
						id: string;
						createdAt: Date;
						updatedAt: Date;
						email: string;
						pointBalance: number;
					}> => {
						throw new Error("Function not implemented.");
					},
				},
			};

			// Setup mock transaction
			const mockPrismaTransaction = mock<
				(
					callback: (
						tx: TransactionClient,
					) => Promise<Transaction & { details: TransactionDetail[] }>,
				) => Promise<Transaction & { details: TransactionDetail[] }>
			>(async (callback) => callback(mockTx as TransactionClient));

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					$transaction: mockPrismaTransaction,
				},
			}));

			const result = await transactionRepository.create(createTransactionData);

			expect(result.status).toBe(StatusCode.NOT_FOUND);
			expect(result.message).toBe("Customer not found");
		});

		test("should fail when insufficient points", async () => {
			// Setup mock transaction client
			const mockTx: Pick<TransactionClient, "customer"> = {
				customer: {
					findUnique: mock<TransactionClient["customer"]["findUnique"]>(
						async () => ({ ...mockCustomer, pointBalance: 50 }),
					),
					update: (): Promise<{
						name: string;
						id: string;
						createdAt: Date;
						updatedAt: Date;
						email: string;
						pointBalance: number;
					}> => {
						throw new Error("Function not implemented.");
					},
				},
			};

			// Setup mock transaction
			// noinspection DuplicatedCode: for testing purposes
			const mockPrismaTransaction = mock<
				(
					callback: (
						tx: TransactionClient,
					) => Promise<Transaction & { details: TransactionDetail[] }>,
				) => Promise<Transaction & { details: TransactionDetail[] }>
			>(async (callback) => callback(mockTx as TransactionClient));

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					$transaction: mockPrismaTransaction,
				},
			}));

			const result = await transactionRepository.create(createTransactionData);

			expect(result.status).toBe(StatusCode.BAD_REQUEST);
			expect(result.message).toBe("Insufficient points balance");
		});

		test("should fail when vouchers are invalid or inactive", async () => {
			// Setup mock transaction client
			const mockTx: Pick<TransactionClient, "customer" | "voucher"> = {
				customer: {
					findUnique: mock<TransactionClient["customer"]["findUnique"]>(
						async () => mockCustomer,
					),
					update: (): Promise<{
						name: string;
						id: string;
						createdAt: Date;
						updatedAt: Date;
						email: string;
						pointBalance: number;
					}> => {
						throw new Error("Function not implemented.");
					},
				},
				voucher: {
					findMany: mock<TransactionClient["voucher"]["findMany"]>(
						async () => [], // No valid vouchers found
					),
				},
			};

			// Setup mock transaction
			// noinspection DuplicatedCode: for testing purposes
			const mockPrismaTransaction = mock<
				(
					callback: (
						tx: TransactionClient,
					) => Promise<Transaction & { details: TransactionDetail[] }>,
				) => Promise<Transaction & { details: TransactionDetail[] }>
			>(async (callback) => callback(mockTx as TransactionClient));

			// Override prisma mock
			mock.module("../infrastructure/utils/prisma/prisma", () => ({
				prisma: {
					$transaction: mockPrismaTransaction,
				},
			}));

			const result = await transactionRepository.create(createTransactionData);

			expect(result.status).toBe(StatusCode.BAD_REQUEST);
			expect(result.message).toBe(
				"One or more vouchers are invalid or inactive",
			);
		});
	});
});
