import type { Voucher } from "@prisma/client";

export type CreateVoucher = {
	brandId: string;
	name: string;
	description?: string;
	pointCost: number;
	validUntil?: Date;
};

export interface IVoucher {
	getById: (id: string) => Promise<Voucher | null>;
	getByBrandId: (brandId: string) => Promise<Voucher[]>;
	create: (voucher: CreateVoucher) => Promise<Voucher>;
}
