import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss'
})
export class CounterComponent {
  count: number = 0;
  decrease() {
    if (this.count <= 0) {
      return;
    }
    this.count -= 1;
  }
  increase() {
    if (this.count >= 10) {
      return;
    }
    this.count += 1;
  }
} 
