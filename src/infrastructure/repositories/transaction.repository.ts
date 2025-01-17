import type { Transaction } from "@prisma/client";
import { injectable } from "inversify";
import type { CreateTransaction, ITransaction } from "../entities/transaction";
import { prisma } from "../utils/prisma";

@injectable()
export class TransactionRepository implements ITransaction {
	async getById(id: string): Promise<Transaction | null> {
		return prisma.transaction.findUnique({
			where: {
				id,
			},
		});
	}

	async create(data: CreateTransaction): Promise<Transaction> {
		return prisma.$transaction(async (tx) => {
			// Verify customer exists and has enough points
			const customer = await tx.customer.findUnique({
				where: { id: data.customerId },
			});

			if (!customer) {
				throw new Error("Customer not found");
			}

			if (customer.pointBalance < data.totalPoints) {
				throw new Error("Insufficient points");
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
				throw new Error("One or more vouchers are invalid or inactive");
			}

			// Create the transaction
			const transaction = await tx.transaction.create({
				data: {
					customerId: data.customerId,
					totalPoints: data.totalPoints,
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
						decrement: data.totalPoints,
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
	}
}
