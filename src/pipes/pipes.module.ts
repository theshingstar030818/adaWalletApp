import { NgModule } from '@angular/core';
import { JsonNgForPipe } from './json-ng-for/json-ng-for';
import { PaginateArrayPipe } from './paginate-array/paginate-array';

@NgModule({
	
	declarations: [
		JsonNgForPipe,
    PaginateArrayPipe,
	],
	imports: [],
	exports: [
		JsonNgForPipe,
    PaginateArrayPipe,
	]
})
export class PipesModule {}
