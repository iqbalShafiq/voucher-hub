import { inject, injectable } from "inversify";
import type {
	CreateTransaction,
	ITransaction,
} from "../infrastructure/entities/transaction";
import { TYPES } from "../infrastructure/ioc/types";

@injectable()
export class TransactionService {
	constructor(
		@inject(TYPES.TransactionRepository)
		private transactionRepository: ITransaction,
	) {}

	async getById(id: string) {
		return this.transactionRepository.getById(id);
	}

	async create(transaction: CreateTransaction) {
		return this.transactionRepository.create(transaction);
	}
}
