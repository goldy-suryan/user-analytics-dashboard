import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class KpiCardComponent {
  @Input() title = '';
  @Input() value: number | string = '';
}
