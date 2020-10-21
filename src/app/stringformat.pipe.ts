import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'strRemUnderscore'
})
export class StrRemUnderscore implements PipeTransform {

  transform(value: string): string {
    return value.replace(/_/g, ' ');
  }

}
