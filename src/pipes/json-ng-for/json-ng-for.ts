import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the JsonNgForPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'jsonNgFor',
})
export class JsonNgForPipe implements PipeTransform {
  transform(value, args){
    console.log(args);
    let keys = [];
    let counter = args[0];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
      counter--;
      if(counter<=0)break;
    }
    return keys;
  }

}
