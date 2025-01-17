import type { Transaction } from "@prisma/client";

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
	getById: (id: string) => Promise<Transaction | null>;
	create: (data: CreateTransaction) => Promise<Transaction>;
}
