import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import brandRoute from "./presentation/routes/brand.route";
import voucherRoute from "./presentation/routes/voucher.route";

const app = new Elysia()
	.use(
		swagger({
			path: "/docs",
		}),
	)
	.use(brandRoute)
	.use(voucherRoute)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
