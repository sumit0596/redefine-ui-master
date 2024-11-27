import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './autocomplete.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AutocompleteComponent],
  imports: [CommonModule, NgSelectModule, FormsModule],
  exports: [AutocompleteComponent],
})
export class AutocompleteModule {}
