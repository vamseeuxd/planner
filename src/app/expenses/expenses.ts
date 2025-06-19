import { Component, inject, TemplateRef } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { DialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { FormsModule } from '@angular/forms';

export interface IExpense {
  name: string;
  amount: number;
  dueDate: string;
  settledDate: string;
}
@Component({
  selector: 'app-expenses',
  imports: [
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    FormsModule,
    MatBottomSheetModule,
    MatFormFieldModule,
  ],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss',
})
export class Expenses {
  private dialogService = inject(DialogService);
  bottomSheet = inject(MatBottomSheet);
  expenses:IExpense[] = [
    { name: 'Groceries', amount: 150, dueDate: '2023-10-01', settledDate: '2023-10-01' },
    { name: 'Utilities', amount: 100, dueDate: '2023-10-05', settledDate: '2023-10-05' },
    { name: 'Rent', amount: 1200, dueDate: '2023-10-01', settledDate: '2023-10-01' },
    { name: 'Internet', amount: 60, dueDate: '2023-10-02', settledDate: '2023-10-02' },
    { name: 'Transportation', amount: 80, dueDate: '2023-10-03', settledDate: '2023-10-03' },
    { name: 'Groceries', amount: 150, dueDate: '2023-10-01', settledDate: '2023-10-01' },
    { name: 'Utilities', amount: 100, dueDate: '2023-10-05', settledDate: '2023-10-05' },
    { name: 'Rent', amount: 1200, dueDate: '2023-10-01', settledDate: '2023-10-01' },
    { name: 'Internet', amount: 60, dueDate: '2023-10-02', settledDate: '2023-10-02' },
    { name: 'Transportation', amount: 80, dueDate: '2023-10-03', settledDate: '2023-10-03' },
    { name: 'Groceries', amount: 150, dueDate: '2023-10-01', settledDate: '2023-10-01' },
    { name: 'Utilities', amount: 100, dueDate: '2023-10-05', settledDate: '2023-10-05' },
    { name: 'Rent', amount: 1200, dueDate: '2023-10-01', settledDate: '2023-10-01' },
    { name: 'Internet', amount: 60, dueDate: '2023-10-02', settledDate: '2023-10-02' },
    { name: 'Transportation', amount: 80, dueDate: '2023-10-03', settledDate: '2023-10-03' },
    { name: 'Groceries', amount: 150, dueDate: '2023-10-01', settledDate: '2023-10-01' },
    { name: 'Utilities', amount: 100, dueDate: '2023-10-05', settledDate: '2023-10-05' },
    { name: 'Rent', amount: 1200, dueDate: '2023-10-01', settledDate: '2023-10-01' },
    { name: 'Internet', amount: 60, dueDate: '2023-10-02', settledDate: '2023-10-02' },
    { name: 'Transportation', amount: 80, dueDate: '2023-10-03', settledDate: '2023-10-03' },
    { name: 'Groceries', amount: 150, dueDate: '2023-10-01', settledDate: '2023-10-01' },
    { name: 'Utilities', amount: 100, dueDate: '2023-10-05', settledDate: '2023-10-05' },
    { name: 'Rent', amount: 1200, dueDate: '2023-10-01', settledDate: '2023-10-01' },
    { name: 'Internet', amount: 60, dueDate: '2023-10-02', settledDate: '2023-10-02' },
    { name: 'Transportation', amount: 80, dueDate: '2023-10-03', settledDate: '2023-10-03' },
    { name: 'Groceries', amount: 150, dueDate: '2023-10-01', settledDate: '2023-10-01' },
    { name: 'Utilities', amount: 100, dueDate: '2023-10-05', settledDate: '2023-10-05' },
    { name: 'Rent', amount: 1200, dueDate: '2023-10-01', settledDate: '2023-10-01' },
    { name: 'Internet', amount: 60, dueDate: '2023-10-02', settledDate: '2023-10-02' },
    { name: 'Transportation', amount: 80, dueDate: '2023-10-03', settledDate: '2023-10-03' },
  ];
  defaultValues:IExpense = {
    name: '',
    amount: 0,
    dueDate: '',
    settledDate: '',
  };
  bottomSheetRef: MatBottomSheetRef<any, any> | undefined;
  deleteExpense(expense: any) {
    const sub = this.dialogService
      .confirm({
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this expense?',
        confirmText: 'Yes',
        cancelText: 'No',
      })
      .subscribe((result) => {
        if (result) {
          console.log('User confirmed the action');
        } else {
          console.log('User cancelled the action');
        }
        sub.unsubscribe();
      });
  }

  openEditForm(editForm: TemplateRef<any>, data:IExpense): void {
    this.defaultValues = data;
    this.bottomSheetRef = this.bottomSheet.open(editForm);
  }
}
