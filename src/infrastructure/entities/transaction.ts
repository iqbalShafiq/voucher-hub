import type { Transaction } from "@prisma/client";
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

export interface ITransaction {
	getById: (id: string) => Promise<PrismaResponse<Transaction>>;
	create: (data: CreateTransaction) => Promise<PrismaResponse<Transaction>>;
}
