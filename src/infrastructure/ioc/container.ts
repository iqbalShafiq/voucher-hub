import { Container } from "inversify";
import type { IBrand } from "../entities/brand";
import type { ITransaction } from "../entities/transaction";
import type { IVoucher } from "../entities/voucher";
import { BrandRepository } from "../repositories/brand.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { VoucherRepository } from "../repositories/voucher.repository";
import { TYPES } from "./types";

const container = new Container();

container.bind<IBrand>(TYPES.BrandRepository).to(BrandRepository);
container.bind<IVoucher>(TYPES.VoucherRepository).to(VoucherRepository);
container
	.bind<ITransaction>(TYPES.TransactionRepository)
	.to(TransactionRepository);

export { container };
