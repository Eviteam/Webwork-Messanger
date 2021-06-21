import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false

})
export class FilterPipe implements PipeTransform {

  transform(value: any[], filterName: string, propName: string, propLastName: string): any {
    if (!filterName.length) {
      return value;
    }
    const resultArray  = [];
    const name = filterName.toLowerCase();
    for (const item of value) {
     if (item[propName].toLowerCase().includes(name) || item[propLastName].toLowerCase().includes(name)) {
       resultArray.push(item);
     }
    }
    return resultArray;
  }
}
