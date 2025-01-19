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
			return await voucherService.getById(id);
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
										status: { type: "number" },
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
					404: {
						description: "Not Found",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										status: { type: "number" },
										message: { type: "string" },
										code: { type: "string" },
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
			const brandId = query.id as string;
			return await voucherService.getByBrandId(brandId);
		},
		{
			query: t.Object({
				id: t.String(),
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
										status: { type: "number" },
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
					404: {
						description: "Not Found",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										status: { type: "number" },
										message: { type: "string" },
										code: { type: "string" },
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
			return await voucherService.create(body);
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
					200: {
						description: "Created",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										status: { type: "number" },
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
					400: {
						description: "Bad Request",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										status: { type: "number" },
										message: { type: "string" },
										code: { type: "string" },
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
