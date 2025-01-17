import { inject, injectable } from "inversify";
import type {
	CreateVoucher,
	IVoucher,
} from "../infrastructure/entities/voucher";
import { TYPES } from "../infrastructure/ioc/types";

@injectable()
export class VoucherService {
	constructor(
		@inject(TYPES.VoucherRepository)
		private voucherRepository: IVoucher,
	) {}

	async getById(id: string) {
		return this.voucherRepository.getById(id);
	}

	async getByBrandId(brandId: string) {
		return this.voucherRepository.getByBrandId(brandId);
	}

	async create(voucher: CreateVoucher) {
		return this.voucherRepository.create(voucher);
	}
}
