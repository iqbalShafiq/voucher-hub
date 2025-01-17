import type { Brand } from "@prisma/client";

export type CreateBrand = {
	name: string;
};

export interface IBrand {
	getById: (id: string) => Promise<Brand | null>;
	create: (brand: CreateBrand) => Promise<Brand>;
}
