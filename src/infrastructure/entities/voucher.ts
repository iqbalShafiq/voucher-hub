import type { Voucher } from "@prisma/client";
import type { PrismaResponse } from "../utils/prisma/types";

export type CreateVoucher = {
	brandId: string;
	name: string;
	description?: string;
	pointCost: number;
	validUntil?: Date;
};

export interface IVoucher {
	getById: (id: string) => Promise<PrismaResponse<Voucher>>;
	getByBrandId: (brandId: string) => Promise<PrismaResponse<Voucher[]>>;
	create: (voucher: CreateVoucher) => Promise<PrismaResponse<Voucher>>;
}
