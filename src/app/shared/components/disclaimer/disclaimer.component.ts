import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'rd-disclaimer',
  standalone: true,
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss'],
  imports: [CommonModule, SharedModule],
})
export class DisclaimerComponent {
  @Input()
  message: string = '';
}
