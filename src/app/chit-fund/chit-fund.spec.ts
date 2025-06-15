import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChitFund } from './chit-fund';

describe('ChitFund', () => {
  let component: ChitFund;
  let fixture: ComponentFixture<ChitFund>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChitFund]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChitFund);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
