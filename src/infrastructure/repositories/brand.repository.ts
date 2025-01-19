import type { Brand } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { injectable } from "inversify";
import type { CreateBrand, IBrand } from "../entities/brand";
import { prismaSafeCall } from "../utils/prisma/executor";
import { prisma } from "../utils/prisma/prisma";
import PrismaErrorCode from "../utils/prisma/prismaErrorCode";
import type { PrismaResponse } from "../utils/prisma/types";

@injectable()
export class BrandRepository implements IBrand {
	async getById(id: string): Promise<PrismaResponse<Brand>> {
		return await prismaSafeCall.execute(async () => {
			return prisma.brand.findUnique({
				where: {
					id,
				},
			});
		});
	}

	async create(brand: CreateBrand): Promise<PrismaResponse<Brand>> {
		return await prismaSafeCall.execute(async () => {
			if (!brand.name.trim()) {
				throw new PrismaClientKnownRequestError("Brand name cannot be empty", {
					code: PrismaErrorCode.INVALID_REFERENCE,
					clientVersion: "6.2.1",
				});
			}

			return prisma.brand.create({
				data: brand,
			});
		});
	}
}
