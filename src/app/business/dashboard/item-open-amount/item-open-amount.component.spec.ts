import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemOpenAmountComponent } from './item-open-amount.component';

describe('ItemOpenAmountComponent', () => {
  let component: ItemOpenAmountComponent;
  let fixture: ComponentFixture<ItemOpenAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemOpenAmountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemOpenAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
