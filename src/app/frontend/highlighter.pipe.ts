import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlighter'
})
export class HighlighterPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    if(args[0] == '') return value;
    else{
    const re = new RegExp("\\b("+args+"\\b)", 'igm');
    value= value.replace(re, '<span style="color:red" class="highlighted-text">$1</span>');
    return value;
    }
  }

}
