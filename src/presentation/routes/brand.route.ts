import { Elysia, t } from "elysia";
import { container } from "../../infrastructure/ioc/container";
import { TYPES } from "../../infrastructure/ioc/types";
import type { BrandService } from "../../services/brand.service";

const brandService = container.get<BrandService>(TYPES.BrandService);

const brandRoute = new Elysia({ prefix: "/brand" }).post(
	"/",
	async (body) => {
		const brand = await brandService.create(body.body);
		return {
			message: "Brand created",
			data: brand,
		};
	},
	{
		body: t.Object({
			name: t.String(),
		}),
		detail: {
			tags: ["Brand"],
			description: "Create a brand",
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
			},
		},
	},
);

export default brandRoute;
