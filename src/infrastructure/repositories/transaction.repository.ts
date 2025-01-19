import type { Transaction } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { injectable } from "inversify";
import type { CreateTransaction, ITransaction } from "../entities/transaction";
import { prismaSafeCall } from "../utils/prisma/executor";
import { prisma } from "../utils/prisma/prisma";
import PrismaErrorCode from "../utils/prisma/prismaErrorCode";
import type { PrismaResponse } from "../utils/prisma/types";

@injectable()
export class TransactionRepository implements ITransaction {
	async getById(id: string): Promise<PrismaResponse<Transaction>> {
		return prismaSafeCall.execute(async () => {
			return prisma.transaction.findUnique({
				where: {
					id,
				},
				include: {
					details: true,
				},
			});
		});
	}

	async create(data: CreateTransaction): Promise<PrismaResponse<Transaction>> {
		return prismaSafeCall.execute(async () => {
			return prisma.$transaction(async (tx) => {
				// Verify customer exists and has enough points
				const customer = await tx.customer.findUnique({
					where: { id: data.customerId },
				});

				if (!customer) {
					throw new PrismaClientKnownRequestError("Customer not found", {
						code: PrismaErrorCode.NOT_FOUND,
						clientVersion: "6.2.1",
					});
				}

				// Calculate total points required for the transaction
				const totalPoints = data.details.reduce(
					(acc, detail) => acc + detail.pointCost * detail.quantity,
					0,
				);

				if (customer.pointBalance < totalPoints) {
					throw new PrismaClientKnownRequestError(
						"Insufficient points balance",
						{
							code: PrismaErrorCode.INVALID_REFERENCE,
							clientVersion: "6.2.1",
						},
					);
				}

				// Verify all vouchers exist and are active
				const voucherIds = data.details.map((detail) => detail.voucherId);
				const vouchers = await tx.voucher.findMany({
					where: {
						id: { in: voucherIds },
						isActive: true,
						validUntil: {
							gte: new Date(),
						},
					},
				});

				if (vouchers.length !== voucherIds.length) {
					throw new PrismaClientKnownRequestError(
						"One or more vouchers are invalid or inactive",
						{
							code: PrismaErrorCode.INVALID_REFERENCE,
							clientVersion: "6.2.1",
						},
					);
				}

				// Create the transaction
				const transaction = await tx.transaction.create({
					data: {
						customerId: data.customerId,
						totalPoints: totalPoints,
						status: "PENDING",
						details: {
							create: data.details.map((detail) => ({
								voucherId: detail.voucherId,
								quantity: detail.quantity,
								pointCost: detail.pointCost,
							})),
						},
					},
					include: {
						details: true,
					},
				});

				// Update customer's point balance
				await tx.customer.update({
					where: { id: data.customerId },
					data: {
						pointBalance: {
							decrement: totalPoints,
						},
					},
				});

				// Update transaction status to COMPLETED
				const updatedTransaction = await tx.transaction.update({
					where: { id: transaction.id },
					data: { status: "COMPLETED" },
				});

				return {
					...updatedTransaction,
					details: transaction.details,
				};
			});
		});
	}
}
