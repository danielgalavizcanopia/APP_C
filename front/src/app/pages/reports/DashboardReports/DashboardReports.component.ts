import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-reports',
  templateUrl: './DashboardReports.component.html',
  styleUrls: ['./DashboardReports.component.scss'],
})
export class DashboardReportsComponent implements OnInit{

  activeIndex: number = 0;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const tab = params.get('tab');
      this.activeIndex = tab === 'ProjectLog' ? 0 : 1;
    });
  }
}
