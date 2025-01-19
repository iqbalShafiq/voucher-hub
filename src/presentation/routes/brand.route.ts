import { Elysia, t } from "elysia";
import { container } from "../../infrastructure/ioc/container";
import { TYPES } from "../../infrastructure/ioc/types";
import type { BrandService } from "../../services/brand.service";

const brandService = container.get<BrandService>(TYPES.BrandService);

const brandRoute = new Elysia({ prefix: "/brand" }).post(
	"/",
	async ({ body }) => {
		return await brandService.create(body);
	},
	{
		body: t.Object({
			name: t.String(),
		}),
		detail: {
			tags: ["Brand"],
			description: "Create a brand",
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
											name: { type: "string" },
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

export default brandRoute;
