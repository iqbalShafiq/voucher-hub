import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import brandRoute from "./presentation/routes/brand.route";

const app = new Elysia()
	.use(
		swagger({
			path: "/docs",
		}),
	)
	.use(brandRoute)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
