import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AnalyticsService } from '../core/services/analytics.service';
import { KpiCardComponent } from '../shared/components/kpi-card/kpi-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, KpiCardComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  kpis: any = {};
  fromDate!: string;
  toDate!: string;
  signupChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Signups',
      },
    ],
  };
  eventsChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{ label: 'Events', data: [] }],
  };

  purchaseChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{ label: 'Purchases', data: [] }],
  };

  revenueChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{ label: 'Revenue', data: [] }],
  };

  ageChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  genderChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  deviceChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  countryChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.generateLast3MonthsSpan();
    this.loadKPIs();
    this.applyFilters();
  }

  generateLast3MonthsSpan() {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 90);

    this.fromDate = pastDate.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];
  }

  loadKPIs() {
    this.analyticsService.getKPIs().subscribe((data) => {
      this.kpis = data;
    });
  }

  loadSignups() {
    this.analyticsService
      .getSignups({
        from: this.fromDate,
        to: this.toDate,
      })
      .subscribe((data) => {
        this.signupChartData = {
          labels: data.map((d) => d._id),
          datasets: [
            {
              label: 'Signups',
              data: data.map((d) => d.count),
              tension: 0.3,
              fill: false,
            },
          ],
        };
        console.log(this.signupChartData.datasets[0].data);
      });
  }

  loadEvents() {
    this.analyticsService
      .getEvents({
        from: this.fromDate,
        to: this.toDate,
      })
      .subscribe((data) => {
        this.eventsChartData = {
          labels: data.map((d) => d._id),
          datasets: [
            {
              label: 'Events',
              data: data.map((d) => d.count),
            },
          ],
        };
      });
  }

  loadPurchases() {
    this.analyticsService
      .getPurchases({
        from: this.fromDate,
        to: this.toDate,
      })
      .subscribe((data) => {
        const labels = data.map((d) => d._id);

        this.purchaseChartData = {
          labels,
          datasets: [
            {
              label: 'Purchases',
              data: data.map((d) => d.totalPurchases),
            },
          ],
        };

        this.revenueChartData = {
          labels,
          datasets: [
            {
              label: 'Revenue',
              data: data.map((d) => d.totalRevenue),
            },
          ],
        };
      });
  }

  loadUserBreakdowns() {
    const params = {
      from: this.fromDate,
      to: this.toDate,
    };
    this.analyticsService.getBreakdown('age', params).subscribe((data) => {
      this.ageChartData = {
        labels: data.map((d) => d._id),
        datasets: [{ label: 'Age Group', data: data.map((d) => d.count) }],
      };
    });

    this.analyticsService.getBreakdown('gender', params).subscribe((data) => {
      this.genderChartData = {
        labels: data.map((d) => d._id),
        datasets: [{ data: data.map((d) => d.count) }],
      };
    });

    this.analyticsService
      .getBreakdown('device_type', params)
      .subscribe((data) => {
        this.deviceChartData = {
          labels: data.map((d) => d._id),
          datasets: [{ data: data.map((d) => d.count) }],
        };
      });

    this.analyticsService.getBreakdown('country', params).subscribe((data) => {
      this.countryChartData = {
        labels: data.map((d) => d._id),
        datasets: [{ label: 'By Country', data: data.map((d) => d.count) }],
      };
    });
  }

  applyFilters() {
    this.loadSignups();
    this.loadEvents();
    this.loadPurchases();
    this.loadUserBreakdowns();
  }
}
