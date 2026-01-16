import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AnalyticsService } from '../core/services/analytics.service';
import { KpiCardComponent } from '../shared/components/kpi-card/kpi-card.component';
import { dateRangeValidator } from './dateValidator';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    KpiCardComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  kpis: any = {};
  countries: string[] = [];
  genders: string[] = [];
  devices: string[] = [];
  filters = {};
  maxDate = new Date().toISOString().split('T')[0];
  filterForm: FormGroup;

  signupChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };
  eventsChartData: ChartData<'line'> = { labels: [], datasets: [] };
  purchaseChartData: ChartData<'line'> = { labels: [], datasets: [] };
  revenueChartData: ChartData<'line'> = { labels: [], datasets: [] };
  ageChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  genderChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  deviceChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  countryChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  errorMessage = {
    metadataError: '',
    kpiError: '',
    signupError: '',
    eventsError: '',
    purchaseRevenueError: '',
  };

  constructor(
    readonly analyticsService: AnalyticsService,
    readonly fb: FormBuilder
  ) {
    this.filterForm = this.fb.group(
      {
        from: [''],
        to: [''],
        gender: [''],
        country: [''],
        device_type: [''],
      },
      { validators: dateRangeValidator }
    );
  }

  ngOnInit(): void {
    this.loadKPIs();
    this.loadMetadata();
    this.filterForm.valueChanges.subscribe((value) => {
      Object.keys(value).forEach((key) => {
        if (!value[key]) {
          delete value[key];
        }
      });
      this.filters = value;
    });
    this.generateLast3MonthsSpan();
    this.applyFilters();
  }

  generateLast3MonthsSpan() {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 90);

    this.filterForm
      .get('from')
      ?.patchValue(pastDate.toISOString().split('T')[0]);
    this.filterForm.get('to')?.patchValue(today.toISOString().split('T')[0]);
  }

  loadKPIs() {
    this.analyticsService.getKPIs().subscribe({
      next: (data) => {
        this.kpis = data;
      },
      error: (err) => {
        this.errorMessage.kpiError = err;
      },
    });
  }

  loadMetadata() {
    this.analyticsService.getMetadata().subscribe({
      next: (data) => {
        console.log('metadat', data);
        this.countries = data.countries;
        this.genders = data.genders;
        this.devices = data.devices;
      },
      error: (err) => {
        this.errorMessage.metadataError = err;
      },
    });
  }

  loadSignups() {
    this.analyticsService.getSignups(this.filters).subscribe({
      next: (data) => {
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
      },
      error: (err) => {
        this.errorMessage.signupError = err;
        this.signupChartData = { labels: [], datasets: [] };
      },
    });
  }

  loadEvents() {
    this.analyticsService.getEvents(this.filters).subscribe({
      next: (data) => {
        this.eventsChartData = {
          labels: data.map((d) => d._id),
          datasets: [
            {
              label: 'Events',
              data: data.map((d) => d.count),
            },
          ],
        };
      },
      error: (err) => {
        this.errorMessage.eventsError = err;
        this.eventsChartData = { labels: [], datasets: [] };
      },
    });
  }

  loadPurchases() {
    this.analyticsService.getPurchases(this.filters).subscribe({
      next: (data) => {
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
      },
      error: (err) => {
        this.errorMessage.purchaseRevenueError = err;
        this.purchaseChartData = { labels: [], datasets: [] };
        this.revenueChartData = { labels: [], datasets: [] };
      },
    });
  }

  loadUserBreakdowns() {
    const params = this.filters;
    this.analyticsService.getAgeGroups(params).subscribe({
      next: (data) => {
        this.ageChartData = {
          labels: data.map((d) => d._id),
          datasets: [{ label: 'Age Group', data: data.map((d) => d.count) }],
        };
      },
      error: (err) => {
        this.ageChartData = { labels: [], datasets: [] };
      },
    });

    this.analyticsService.getBreakdown('gender', params).subscribe({
      next: (data) => {
        this.genderChartData = {
          labels: data.map((d) => d._id),
          datasets: [{ data: data.map((d) => d.count) }],
        };
      },
      error: (err) => {
        this.genderChartData = { labels: [], datasets: [] };
      },
    });

    this.analyticsService.getBreakdown('device_type', params).subscribe({
      next: (data) => {
        this.deviceChartData = {
          labels: data.map((d) => d._id),
          datasets: [{ data: data.map((d) => d.count) }],
        };
      },
      error: (err) => {
        this.deviceChartData = { labels: [], datasets: [] };
      },
    });

    this.analyticsService.getBreakdown('country', params).subscribe({
      next: (data) => {
        this.countryChartData = {
          labels: data.map((d) => d._id),
          datasets: [{ label: 'By Country', data: data.map((d) => d.count) }],
        };
      },
      error: (err) => {
        this.countryChartData = { labels: [], datasets: [] };
      },
    });
  }

  applyFilters() {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }
    this.loadSignups();
    this.loadEvents();
    this.loadPurchases();
    this.loadUserBreakdowns();
  }

  clearFilter() {
    this.filterForm.reset();
    this.generateLast3MonthsSpan();
    this.applyFilters();
  }
}
