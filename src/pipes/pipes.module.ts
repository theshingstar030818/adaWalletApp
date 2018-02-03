import { NgModule } from '@angular/core';
import { JsonNgForPipe } from './json-ng-for/json-ng-for';
import { PaginateArrayPipe } from './paginate-array/paginate-array';
import { AmountPipe } from './amount/amount';
import { LowercasePipe } from './lowercase/lowercase';

@NgModule({
	
	declarations: [
		JsonNgForPipe,
    PaginateArrayPipe,
    AmountPipe,
    LowercasePipe,
	],
	imports: [],
	exports: [
		JsonNgForPipe,
    PaginateArrayPipe,
    AmountPipe,
    LowercasePipe,
	]
})
export class PipesModule {}
