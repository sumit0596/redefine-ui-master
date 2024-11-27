import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'rd-rating',
  standalone: true,
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  imports: [CommonModule],
})
export class RatingComponent implements OnInit {
  stars!: any[];

  @Input() width: number = 22;
  @Input() count: number = 6;
  @Input() rating!: any;
  @Input() editable: boolean = true;
  @Input() stroke: string = '#ffffff';
  @Input() fill: string = '#ffffff';
  @Input() type: string = 'solid';

  @Output() onChange: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {
    if (this.editable) {
      this.stars = Array(this.count).fill(false);
    } else {
      if (this.rating != '') {
        this.stars = Array(parseInt(this.rating)).fill(false);
      }
    }
    this.fillRating();
  }
  clear() {
    this.stars = Array(this.count).fill(false);
    this.onChange.emit(0);
  }
  fillRating() {
    if (this.stars != undefined) {
      this.stars = this.stars.map((star, i) => parseInt(this.rating) > i);
    }
  }
  rate(rating: number) {
    if (this.stars != undefined) {
      this.stars = this.stars.map((star, i) => rating > i);
      this.onChange.emit(rating);
    }
  }
}
