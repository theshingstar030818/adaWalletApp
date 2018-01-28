import { Pipe, PipeTransform } from '@angular/core';
import { BigNumber } from 'bignumber.js';

/**
 * Generated class for the AmountPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'amount',
})
export class AmountPipe implements PipeTransform {
  transform(value: BigNumber, args) {
    console.log(value);
    if(value){
      let x: BigNumber = new BigNumber (value);
      console.log(x);
      return x.toPrecision(6);
    }
    return value;    
  }
}
