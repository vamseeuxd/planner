import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { DialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { FormsModule, NgForm } from '@angular/forms';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { LoaderService } from '../confirmation-dialog/loader.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface IExpense {
  id: string;
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
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss',
})
export class Expenses implements OnInit {
  formTitle = 'Edit Expense Details';
  isEditMode = false;
  private dialogService = inject(DialogService);
  bottomSheet = inject(MatBottomSheet);
  firestore: Firestore = inject(Firestore);
  loaderService = inject(LoaderService);
  snackBar = inject(MatSnackBar);

  dbPath = '/expenses';
  expenses: IExpense[] = [
    {
      name: 'Groceries',
      amount: 150,
      dueDate: '2023-10-01',
      settledDate: '2023-10-01',
      id: '',
    },
    {
      name: 'Utilities',
      amount: 100,
      dueDate: '2023-10-05',
      settledDate: '2023-10-05',
      id: '',
    },
    {
      name: 'Rent',
      amount: 1200,
      dueDate: '2023-10-01',
      settledDate: '2023-10-01',
      id: '',
    },
    {
      name: 'Internet',
      amount: 60,
      dueDate: '2023-10-02',
      settledDate: '2023-10-02',
      id: '',
    },
    {
      name: 'Transportation',
      amount: 80,
      dueDate: '2023-10-03',
      settledDate: '2023-10-03',
      id: '',
    },
    {
      name: 'Groceries',
      amount: 150,
      dueDate: '2023-10-01',
      settledDate: '2023-10-01',
      id: '',
    },
    {
      name: 'Utilities',
      amount: 100,
      dueDate: '2023-10-05',
      settledDate: '2023-10-05',
      id: '',
    },
    {
      name: 'Rent',
      amount: 1200,
      dueDate: '2023-10-01',
      settledDate: '2023-10-01',
      id: '',
    },
    {
      name: 'Internet',
      amount: 60,
      dueDate: '2023-10-02',
      settledDate: '2023-10-02',
      id: '',
    },
    {
      name: 'Transportation',
      amount: 80,
      dueDate: '2023-10-03',
      settledDate: '2023-10-03',
      id: '',
    },
    {
      name: 'Groceries',
      amount: 150,
      dueDate: '2023-10-01',
      settledDate: '2023-10-01',
      id: '',
    },
    {
      name: 'Utilities',
      amount: 100,
      dueDate: '2023-10-05',
      settledDate: '2023-10-05',
      id: '',
    },
    {
      name: 'Rent',
      amount: 1200,
      dueDate: '2023-10-01',
      settledDate: '2023-10-01',
      id: '',
    },
    {
      name: 'Internet',
      amount: 60,
      dueDate: '2023-10-02',
      settledDate: '2023-10-02',
      id: '',
    },
    {
      name: 'Transportation',
      amount: 80,
      dueDate: '2023-10-03',
      settledDate: '2023-10-03',
      id: '',
    },
    {
      name: 'Groceries',
      amount: 150,
      dueDate: '2023-10-01',
      settledDate: '2023-10-01',
      id: '',
    },
    {
      name: 'Utilities',
      amount: 100,
      dueDate: '2023-10-05',
      settledDate: '2023-10-05',
      id: '',
    },
    {
      name: 'Rent',
      amount: 1200,
      dueDate: '2023-10-01',
      settledDate: '2023-10-01',
      id: '',
    },
    {
      name: 'Internet',
      amount: 60,
      dueDate: '2023-10-02',
      settledDate: '2023-10-02',
      id: '',
    },
    {
      name: 'Transportation',
      amount: 80,
      dueDate: '2023-10-03',
      settledDate: '2023-10-03',
      id: '',
    },
    {
      name: 'Groceries',
      amount: 150,
      dueDate: '2023-10-01',
      settledDate: '2023-10-01',
      id: '',
    },
    {
      name: 'Utilities',
      amount: 100,
      dueDate: '2023-10-05',
      settledDate: '2023-10-05',
      id: '',
    },
    {
      name: 'Rent',
      amount: 1200,
      dueDate: '2023-10-01',
      settledDate: '2023-10-01',
      id: '',
    },
    {
      name: 'Internet',
      amount: 60,
      dueDate: '2023-10-02',
      settledDate: '2023-10-02',
      id: '',
    },
    {
      name: 'Transportation',
      amount: 80,
      dueDate: '2023-10-03',
      settledDate: '2023-10-03',
      id: '',
    },
    {
      name: 'Groceries',
      amount: 150,
      dueDate: '2023-10-01',
      settledDate: '2023-10-01',
      id: '',
    },
    {
      name: 'Utilities',
      amount: 100,
      dueDate: '2023-10-05',
      settledDate: '2023-10-05',
      id: '',
    },
    {
      name: 'Rent',
      amount: 1200,
      dueDate: '2023-10-01',
      settledDate: '2023-10-01',
      id: '',
    },
    {
      name: 'Internet',
      amount: 60,
      dueDate: '2023-10-02',
      settledDate: '2023-10-02',
      id: '',
    },
    {
      name: 'Transportation',
      amount: 80,
      dueDate: '2023-10-03',
      settledDate: '2023-10-03',
      id: '',
    },
  ];
  defaultValues: IExpense = {
    id: '',
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
          const id = this.loaderService.show();
          this.delete(expense.id)
            .then(() => {
              console.log('Expense deleted successfully');
              this.loaderService.hide(id);
              this.snackBar.open('Expense deleted successfully', 'Close', {
                duration: 3000,
                panelClass: ['snackbar-success'],
              });
            })
            .catch((error) => {
              console.error('Error deleting expense:', error);
              this.loaderService.hide(id);
              this.snackBar.open('Error deleting expense', 'Close', {
                duration: 3000,
                panelClass: ['snackbar-error'],
              });
            });
        } else {
          console.log('User cancelled the action');
        }
        sub.unsubscribe();
      });
  }

  openCloneForm(editForm: TemplateRef<any>, data: IExpense): void {
    this.formTitle = 'Add Expense Details';
    this.isEditMode = false;
    this.defaultValues = data;
    this.bottomSheetRef = this.bottomSheet.open(editForm);
  }
  openEditForm(editForm: TemplateRef<any>, data: IExpense): void {
    this.formTitle = 'Edit Expense Details';
    this.defaultValues = data;
    this.isEditMode = true;
    this.bottomSheetRef = this.bottomSheet.open(editForm);
  }
  openAddForm(editForm: TemplateRef<any>): void {
    this.formTitle = 'Add Expense Details';
    this.isEditMode = false;
    this.defaultValues = {
      id: '',
      name: '',
      amount: 0,
      dueDate: '',
      settledDate: '',
    };
    this.bottomSheetRef = this.bottomSheet.open(editForm);
  }

  getAll(): Observable<any> {
    return collectionData(collection(this.firestore, this.dbPath));
  }

  ngOnInit() {
    const id = this.loaderService.show();
    this.getAll().subscribe((data) => {
      this.expenses = [];
      console.log('Fetched expenses:', data);
      this.expenses = data.map((item: any) => {
        return { ...item, id: item.id };
      });
      console.log('Expenses:', this.expenses);
      this.loaderService.hide(id);
    });
  }

  save(editExpenseForm: NgForm, bottomSheet: MatBottomSheet) {
    if (this.isEditMode) {
      const id = this.loaderService.show();
      this.edit(this.defaultValues.id, editExpenseForm.value)
        .then(() => {
          console.log('Expense updated successfully');
          editExpenseForm.resetForm({});
          bottomSheet.dismiss();
          this.loaderService.hide(id);
          this.snackBar.open('Expense updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
        })
        .catch((error) => {
          console.error('Error updating expense:', error);
          this.loaderService.hide(id);
          this.snackBar.open('Error updating expense', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        });
      return;
    } else {
      const id = this.loaderService.show();
      this.add(editExpenseForm.value)
        .then(() => {
          console.log('Expense added successfully');
          editExpenseForm.resetForm({});
          bottomSheet.dismiss();
          this.loaderService.hide(id);
          this.snackBar.open('Expense added successfully', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
        })
        .catch((error) => {
          console.error('Error adding expense:', error);
          this.loaderService.hide(id);
          this.snackBar.open('Error adding expense', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        });
    }
  }

  getById(id: any): Observable<any> {
    return docData(doc(this.firestore, this.dbPath + '/' + id));
  }

  async add(data: any) {
    console.log('data', data);
    delete data.id; // Ensure id is not included in the data to be added
    await addDoc(collection(this.firestore, this.dbPath), data).then(
      (ref: any) => {
        setDoc(ref, { ...data, id: ref.id });
        return ref;
      }
    );
  }

  async edit(id: string, data: any) {
    delete data.id; // Ensure id is not included in the data to be updated
    console.log('data', data);
    await updateDoc(doc(this.firestore, this.dbPath + '/' + id), data);
  }

  async delete(id: string) {
    await deleteDoc(doc(this.firestore, this.dbPath + '/' + id));
  }
}
