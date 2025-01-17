import { Elysia, t } from "elysia";
import { container } from "../../infrastructure/ioc/container";
import { TYPES } from "../../infrastructure/ioc/types";
import type { VoucherService } from "../../services/voucher.service";

const voucherService = container.get<VoucherService>(TYPES.VoucherService);

const voucherRoute = new Elysia({ prefix: "/voucher" })
	.get(
		"/",
		async ({ query }) => {
			const id = query.id as string;
			const voucher = await voucherService.getById(id);
			return {
				message: "Voucher found",
				data: voucher,
			};
		},
		{
			query: t.Object({
				id: t.String(),
			}),
			detail: {
				tags: ["Voucher"],
				description: "Get a voucher",
				responses: {
					200: {
						description: "OK",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										message: { type: "string" },
										data: {
											type: "object",
											properties: {
												id: { type: "number" },
												brandId: { type: "number" },
												name: { type: "string" },
												description: { type: "string" },
												pointCost: { type: "number" },
												isActive: { type: "boolean" },
												validUntil: { type: "string" },
												createdAt: { type: "string" },
												updatedAt: { type: "string" },
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	)
	.get(
		"brand/",
		async ({ query }) => {
			const brandId = query.brandId as string;
			const vouchers = await voucherService.getByBrandId(brandId);
			return {
				message: "Vouchers found",
				data: vouchers,
			};
		},
		{
			query: t.Object({
				brandId: t.String(),
			}),
			detail: {
				tags: ["Voucher"],
				description: "Get vouchers by brand",
				responses: {
					200: {
						description: "OK",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										message: { type: "string" },
										data: {
											type: "array",
											items: {
												type: "object",
												properties: {
													id: { type: "number" },
													brandId: { type: "number" },
													name: { type: "string" },
													description: { type: "string" },
													pointCost: { type: "number" },
													isActive: { type: "boolean" },
													validUntil: { type: "string" },
													createdAt: { type: "string" },
													updatedAt: { type: "string" },
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	)
	.post(
		"/",
		async ({ body }) => {
			const voucher = await voucherService.create(body);
			return {
				message: "Voucher created",
				data: voucher,
			};
		},
		{
			body: t.Object({
				brandId: t.String(),
				name: t.String(),
				description: t.String(),
				pointCost: t.Number(),
				validUntil: t.Date(),
			}),
			detail: {
				tags: ["Voucher"],
				description: "Create a voucher",
				responses: {
					201: {
						description: "Created",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										message: { type: "string" },
										data: {
											type: "object",
											properties: {
												id: { type: "number" },
												brandId: { type: "number" },
												name: { type: "string" },
												description: { type: "string" },
												pointCost: { type: "number" },
												isActive: { type: "boolean" },
												validUntil: { type: "string" },
												createdAt: { type: "string" },
												updatedAt: { type: "string" },
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	);

export default voucherRoute;
