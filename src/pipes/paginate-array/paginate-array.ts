import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the PaginateArrayPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'paginateArray',
})
export class PaginateArrayPipe implements PipeTransform {
  transform(value, args) {
    console.log(value, args);
    let x = <Array<any>>(value);
    if(value instanceof Array){
      x = x.slice(0, args[0]);
    }else{
      x = [];
    }
    return x;
  }
}