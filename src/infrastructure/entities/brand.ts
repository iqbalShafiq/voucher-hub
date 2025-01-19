import type { Brand } from "@prisma/client";
import type { PrismaResponse } from "../utils/prisma/types";

export type CreateBrand = {
	name: string;
};

export interface IBrand {
	getById: (id: string) => Promise<PrismaResponse<Brand>>;
	create: (brand: CreateBrand) => Promise<PrismaResponse<Brand>>;
}
