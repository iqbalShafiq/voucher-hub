import type { Voucher } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { injectable } from "inversify";
import type { CreateVoucher, IVoucher } from "../entities/voucher";
import { prismaSafeCall } from "../utils/prisma/executor";
import { prisma } from "../utils/prisma/prisma";
import PrismaErrorCode from "../utils/prisma/prismaErrorCode";
import type { PrismaResponse } from "../utils/prisma/types";

@injectable()
export class VoucherRepository implements IVoucher {
	async getById(id: string): Promise<PrismaResponse<Voucher>> {
		return prismaSafeCall.execute(async () => {
			return prisma.voucher.findUnique({
				where: {
					id,
				},
			});
		});
	}

	async getByBrandId(brandId: string): Promise<PrismaResponse<Voucher[]>> {
		return prismaSafeCall.execute(async () => {
			return prisma.voucher.findMany({
				where: {
					brandId,
				},
			});
		});
	}

	async create(voucher: CreateVoucher): Promise<PrismaResponse<Voucher>> {
		return prismaSafeCall.execute(async () => {
			if (!voucher.name.trim()) {
				throw new PrismaClientKnownRequestError(
					"Voucher name cannot be empty",
					{
						code: PrismaErrorCode.INVALID_REFERENCE,
						clientVersion: "6.2.1",
					},
				);
			}

			if (voucher.pointCost <= 0) {
				throw new PrismaClientKnownRequestError(
					"Point cost must be greater than zero",
					{
						code: PrismaErrorCode.INVALID_REFERENCE,
						clientVersion: "6.2.1",
					},
				);
			}

			if (!voucher.validUntil) {
				throw new PrismaClientKnownRequestError(
					"Valid until date is required",
					{
						code: PrismaErrorCode.INVALID_REFERENCE,
						clientVersion: "6.2.1",
					},
				);
			}

			return prisma.voucher.create({
				data: voucher,
			});
		});
	}
}
