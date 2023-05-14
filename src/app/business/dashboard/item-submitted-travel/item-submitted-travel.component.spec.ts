import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSubmittedTravelComponent } from './item-submitted-travel.component';

describe('ItemSubmittedTravelComponent', () => {
  let component: ItemSubmittedTravelComponent;
  let fixture: ComponentFixture<ItemSubmittedTravelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemSubmittedTravelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSubmittedTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
