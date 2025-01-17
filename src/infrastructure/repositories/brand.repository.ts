import type { Brand } from "@prisma/client";
import { injectable } from "inversify";
import type { CreateBrand, IBrand } from "../entities/brand";
import { prisma } from "../utils/prisma";

@injectable()
export class BrandRepository implements IBrand {
	async getById(id: string): Promise<Brand | null> {
		return prisma.brand.findUnique({
			where: {
				id,
			},
		});
	}

	async create(brand: CreateBrand): Promise<Brand> {
		return prisma.brand.create({
			data: brand,
		});
	}
}
