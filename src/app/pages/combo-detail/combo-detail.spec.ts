import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboDetail } from './combo-detail';

describe('ComboDetail', () => {
  let component: ComboDetail;
  let fixture: ComponentFixture<ComboDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComboDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
