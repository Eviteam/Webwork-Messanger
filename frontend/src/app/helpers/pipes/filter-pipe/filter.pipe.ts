import { Pipe, PipeTransform } from '@angular/core';



@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], searchUser: string, propName: string, propLastName: string): any {
    const name: any = searchUser.toLowerCase();
    const contactedName = name.replace(/\s/g, '');
    if (value) {
      value?.map(user => user.fullName = `${user[propName]} ${user[propLastName]}`);
    }
    if (!name.length) {
      return value;
    }
    return value.filter(item => item.fullName.toLowerCase().includes(name) || item.fullName.toLowerCase().includes(contactedName));
  }
}
