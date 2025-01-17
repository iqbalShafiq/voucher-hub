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
			const id = query.id as string;
			const transaction = await transactionService.getById(id);
			return {
				message: "Transaction found",
				data: transaction,
			};
		},
		{
			query: t.Object({
				id: t.String(),
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
										message: { type: "string" },
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
				},
			},
		},
	)
	.post(
		"/",
		async ({ body }) => {
			const transaction = await transactionService.create(body);
			return {
				message: "Transaction created",
				data: transaction,
			};
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
				},
			},
		},
	);

export default transactionRoute;
