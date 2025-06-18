import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expenses',
  imports: [MatListModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss',
})
export class Expenses {
  expenses = [
    { name: 'Groceries', amount: 150, date: new Date('2023-10-01') },
    { name: 'Utilities', amount: 100, date: new Date('2023-10-05') },
    { name: 'Rent', amount: 1200, date: new Date('2023-10-01') },
    { name: 'Internet', amount: 60, date: new Date('2023-10-02') },
    { name: 'Transportation', amount: 80, date: new Date('2023-10-03') },
    { name: 'Groceries', amount: 150, date: new Date('2023-10-01') },
    { name: 'Utilities', amount: 100, date: new Date('2023-10-05') },
    { name: 'Rent', amount: 1200, date: new Date('2023-10-01') },
    { name: 'Internet', amount: 60, date: new Date('2023-10-02') },
    { name: 'Transportation', amount: 80, date: new Date('2023-10-03') },
    { name: 'Groceries', amount: 150, date: new Date('2023-10-01') },
    { name: 'Utilities', amount: 100, date: new Date('2023-10-05') },
    { name: 'Rent', amount: 1200, date: new Date('2023-10-01') },
    { name: 'Internet', amount: 60, date: new Date('2023-10-02') },
    { name: 'Transportation', amount: 80, date: new Date('2023-10-03') },
    { name: 'Groceries', amount: 150, date: new Date('2023-10-01') },
    { name: 'Utilities', amount: 100, date: new Date('2023-10-05') },
    { name: 'Rent', amount: 1200, date: new Date('2023-10-01') },
    { name: 'Internet', amount: 60, date: new Date('2023-10-02') },
    { name: 'Transportation', amount: 80, date: new Date('2023-10-03') },
    { name: 'Groceries', amount: 150, date: new Date('2023-10-01') },
    { name: 'Utilities', amount: 100, date: new Date('2023-10-05') },
    { name: 'Rent', amount: 1200, date: new Date('2023-10-01') },
    { name: 'Internet', amount: 60, date: new Date('2023-10-02') },
    { name: 'Transportation', amount: 80, date: new Date('2023-10-03') },
    { name: 'Groceries', amount: 150, date: new Date('2023-10-01') },
    { name: 'Utilities', amount: 100, date: new Date('2023-10-05') },
    { name: 'Rent', amount: 1200, date: new Date('2023-10-01') },
    { name: 'Internet', amount: 60, date: new Date('2023-10-02') },
    { name: 'Transportation', amount: 80, date: new Date('2023-10-03') },
  ];
}
