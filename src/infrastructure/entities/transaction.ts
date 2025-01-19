import type { Transaction, TransactionDetail } from "@prisma/client";
import type { PrismaResponse } from "../utils/prisma/types";

export type TransactionDetailItem = {
	voucherId: string;
	quantity: number;
	pointCost: number;
};

export type CreateTransaction = {
	customerId: string;
	details: TransactionDetailItem[];
};

export type TransactionWithDetails = Transaction & {
	details: TransactionDetail[];
};

export interface ITransaction {
	getById: (id: string) => Promise<PrismaResponse<TransactionWithDetails>>;
	create: (
		data: CreateTransaction,
	) => Promise<PrismaResponse<TransactionWithDetails>>;
}
