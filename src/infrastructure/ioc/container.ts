import { Container } from "inversify";
import { BrandService } from "../../services/brand.service";
import { TransactionService } from "../../services/transaction.service";
import { VoucherService } from "../../services/voucher.service";
import type { IBrand } from "../entities/brand";
import type { ITransaction } from "../entities/transaction";
import type { IVoucher } from "../entities/voucher";
import { BrandRepository } from "../repositories/brand.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { VoucherRepository } from "../repositories/voucher.repository";
import { TYPES } from "./types";

const container = new Container();

container.bind<IBrand>(TYPES.BrandRepository).to(BrandRepository);
container.bind<BrandService>(TYPES.BrandService).to(BrandService);

container.bind<IVoucher>(TYPES.VoucherRepository).to(VoucherRepository);
container.bind<VoucherService>(TYPES.VoucherService).to(VoucherService);

container
	.bind<ITransaction>(TYPES.TransactionRepository)
	.to(TransactionRepository);
container
	.bind<TransactionService>(TYPES.TransactionService)
	.to(TransactionService);

export { container };
