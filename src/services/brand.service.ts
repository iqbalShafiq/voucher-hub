import { inject, injectable } from "inversify";
import type { CreateBrand, IBrand } from "../infrastructure/entities/brand";
import { TYPES } from "../infrastructure/ioc/types";

@injectable()
export class BrandService {
	constructor(
		@inject(TYPES.BrandRepository)
		private brandRepository: IBrand,
	) {}

	async getById(id: string) {
		return this.brandRepository.getById(id);
	}

	async create(brand: CreateBrand) {
		return this.brandRepository.create(brand);
	}
}
