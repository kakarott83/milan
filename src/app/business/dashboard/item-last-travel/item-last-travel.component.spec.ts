import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemLastTravelComponent } from './item-last-travel.component';

describe('ItemLastTravelComponent', () => {
  let component: ItemLastTravelComponent;
  let fixture: ComponentFixture<ItemLastTravelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemLastTravelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemLastTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
