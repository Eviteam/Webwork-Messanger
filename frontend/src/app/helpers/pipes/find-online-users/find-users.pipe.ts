import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findUsers'
})
export class FindUsersPipe implements PipeTransform {

  transform(users: any[], ): any {
   return  users.filter(user => user.is_online);
  }

}
