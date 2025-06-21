import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomesCategories } from './incomes-categories';

describe('IncomesCategories', () => {
  let component: IncomesCategories;
  let fixture: ComponentFixture<IncomesCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomesCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomesCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
