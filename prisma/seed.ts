// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// Create test customers
	const customers = await prisma.customer.createMany({
		data: [
			{
				id: "test-customer-1",
				email: "customer1@test.com",
				name: "Test Customer 1",
				pointBalance: 1000000,
			},
			{
				id: "test-customer-2",
				email: "customer2@test.com",
				name: "Test Customer 2",
				pointBalance: 500000,
			},
		],
		skipDuplicates: true,
	});

	console.log(`Created ${customers.count} customers`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
