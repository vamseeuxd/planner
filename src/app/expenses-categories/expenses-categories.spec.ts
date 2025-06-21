import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesCategories } from './expenses-categories';

describe('ExpensesCategories', () => {
  let component: ExpensesCategories;
  let fixture: ComponentFixture<ExpensesCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
