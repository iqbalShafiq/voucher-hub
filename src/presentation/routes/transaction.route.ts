import { Elysia, t } from "elysia";
import { container } from "../../infrastructure/ioc/container";
import { TYPES } from "../../infrastructure/ioc/types";
import type { TransactionService } from "../../services/transaction.service";

const transactionService = container.get<TransactionService>(
	TYPES.TransactionService,
);

const transactionRoute = new Elysia({ prefix: "/transaction/redemption" })
	.get(
		"/",
		async ({ query }) => {
			const id = query.transactionId as string;
			return await transactionService.getById(id);
		},
		{
			query: t.Object({
				transactionId: t.String(),
			}),
			detail: {
				tags: ["Transaction"],
				description: "Get a transaction",
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
												userId: { type: "number" },
												voucherId: { type: "number" },
												quantity: { type: "number" },
												pointCost: { type: "number" },
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
	.post(
		"/",
		async ({ body }) => {
			return await transactionService.create(body);
		},
		{
			body: t.Object({
				customerId: t.String(),
				details: t.Array(
					t.Object({
						brandId: t.String(),
						pointCost: t.Number(),
						voucherId: t.String(),
						quantity: t.Number(),
					}),
				),
			}),
			detail: {
				tags: ["Transaction"],
				description: "Create a transaction",
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
												userId: { type: "number" },
												voucherId: { type: "number" },
												quantity: { type: "number" },
												pointCost: { type: "number" },
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
	);

export default transactionRoute;
