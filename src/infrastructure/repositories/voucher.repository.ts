import type { Voucher } from "@prisma/client";
import { injectable } from "inversify";
import type { CreateVoucher, IVoucher } from "../entities/voucher";
import { prisma } from "../utils/prisma";

@injectable()
export class VoucherRepository implements IVoucher {
	async getById(id: string): Promise<Voucher | null> {
		return prisma.voucher.findUnique({
			where: {
				id,
			},
		});
	}

	async getByBrandId(brandId: string): Promise<Voucher[]> {
		return prisma.voucher.findMany({
			where: {
				brandId,
			},
		});
	}

	async create(voucher: CreateVoucher): Promise<Voucher> {
		return prisma.voucher.create({
			data: voucher,
		});
	}
}
