import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendsDialogComponent } from './spends-dialog.component';

describe('SpendsDialogComponent', () => {
  let component: SpendsDialogComponent;
  let fixture: ComponentFixture<SpendsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpendsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpendsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
