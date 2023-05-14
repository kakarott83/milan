import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemWorktimeComponent } from './item-worktime.component';

describe('ItemWorktimeComponent', () => {
  let component: ItemWorktimeComponent;
  let fixture: ComponentFixture<ItemWorktimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemWorktimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemWorktimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
