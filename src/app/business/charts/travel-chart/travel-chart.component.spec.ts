import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelChartComponent } from './travel-chart.component';

describe('TravelChartComponent', () => {
  let component: TravelChartComponent;
  let fixture: ComponentFixture<TravelChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
