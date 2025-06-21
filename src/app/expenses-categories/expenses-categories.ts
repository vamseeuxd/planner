import { Component, inject, signal, TemplateRef } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth';
import { DialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { LoaderService } from '../confirmation-dialog/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '@angular/fire/auth';

// Constants for hardcoded values
const CONSTANTS = {
  DB_PATH: '/expenses-categories',
  MONTH_DISPLAY: '10-JAN-2025',
  DEFAULT_COUNT: 10,
  DEFAULT_AMOUNT: 2000,
  CURRENCY: 'INR',
  SNACKBAR_DURATION: 3000,
  SNACKBAR_SUCCESS_CLASS: ['snackbar-success'],
  SNACKBAR_ERROR_CLASS: ['snackbar-error'],
  LIST_MAX_HEIGHT: 'calc(100vh - 300px)',
  LIST_MIN_HEIGHT: 'calc(100vh - 300px)',
};

// Interface for Expense
interface IExpensesCategory {
  id: string;
  name: string;
  descrition: string;
  email: string;
}

@Component({
  selector: 'app-expenses-categories',
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
    MatSnackBarModule,
  ],
  templateUrl: './expenses-categories.html',
  styleUrl: './expenses-categories.scss',
})
export class ExpensesCategories {
  // Injected services
  dialogService = inject(DialogService);
  bottomSheet = inject(MatBottomSheet);
  firestore = inject(Firestore);
  loaderService = inject(LoaderService);
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);

  // Signals for reactive state
  expensesCategories = signal<IExpensesCategory[]>([]);
  formTitle = signal('Edit Expenses Category Details');
  isEditMode = signal(false);
  user: User | undefined;
  defaultValues = signal<IExpensesCategory>({
    id: '',
    name: '',
    descrition: '',
    email: '',
  });

  constructor() {
    // Initialize data fetch
    this.authService.user$.subscribe((user) => {
      if (!user) {
        this.snackBar.open('Please log in to view Expenses Category', 'Close', {
          duration: CONSTANTS.SNACKBAR_DURATION,
          panelClass: CONSTANTS.SNACKBAR_ERROR_CLASS,
        });
      } else {
        this.user = user;
        // Fetch expenses when user is authenticated
        this.fetchExpensesCategories();
      }
    });
  }

  async fetchExpensesCategories() {
    const id = this.loaderService.show();
    try {
      const expensesCollection = collection(this.firestore, CONSTANTS.DB_PATH);
      // Query expenses for the selected month and user email
      const q = query(
        expensesCollection,
        where('email', '==', this.user?.email)
      );
      collectionData(q, { idField: 'id' }).subscribe((data) => {
        this.expensesCategories.set(data as IExpensesCategory[]);
        this.loaderService.hide(id);
      });
    } catch (error) {
      console.error('Error fetching Expenses Category:', error);
      this.loaderService.hide(id);
    }
  }

  openEditForm(editExpenseCategoryForm: TemplateRef<any>, data: IExpensesCategory): void {
    this.formTitle.set('Edit Expense Category Details');
    this.isEditMode.set(true);
    const formData = { ...data };
    this.defaultValues.set(formData);
    this.bottomSheet.open(editExpenseCategoryForm);
  }

  deleteExpense(expense: IExpensesCategory) {
    this.dialogService
      .confirm({
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this Expense Category?',
        confirmText: 'Yes',
        cancelText: 'No',
      })
      .subscribe({
        next: async (result) => {
          if (result) {
            const id = this.loaderService.show();
            try {
              await this.delete(expense.id);
              this.snackBar.open('Expense deleted successfully', 'Close', {
                duration: CONSTANTS.SNACKBAR_DURATION,
                panelClass: CONSTANTS.SNACKBAR_SUCCESS_CLASS,
              });
            } catch (error) {
              console.error('Error deleting Expense Category:', error);
              this.snackBar.open('Error deleting Expense Category', 'Close', {
                duration: CONSTANTS.SNACKBAR_DURATION,
                panelClass: CONSTANTS.SNACKBAR_ERROR_CLASS,
              });
            } finally {
              this.loaderService.hide(id);
            }
          }
        },
      });
  }

  async delete(id: string) {
    await deleteDoc(doc(this.firestore, `${CONSTANTS.DB_PATH}/${id}`));
  }

  async save(editExpenseCategoryForm: NgForm) {
    const id = this.loaderService.show();
    try {
      const formValue = editExpenseCategoryForm.value;
      if (this.isEditMode()) {
        await this.edit(this.defaultValues().id, formValue);
        this.snackBar.open('Expense Category updated successfully', 'Close', {
          duration: CONSTANTS.SNACKBAR_DURATION,
          panelClass: CONSTANTS.SNACKBAR_SUCCESS_CLASS,
        });
      } else {
        await this.add(formValue);
        this.snackBar.open('Expense Category added successfully', 'Close', {
          duration: CONSTANTS.SNACKBAR_DURATION,
          panelClass: CONSTANTS.SNACKBAR_SUCCESS_CLASS,
        });
      }
      editExpenseCategoryForm.resetForm({});
      this.bottomSheet.dismiss();
    } catch (error) {
      console.error('Error saving Expense Category:', error);
      this.snackBar.open('Error saving Expense Category', 'Close', {
        duration: CONSTANTS.SNACKBAR_DURATION,
        panelClass: CONSTANTS.SNACKBAR_ERROR_CLASS,
      });
    } finally {
      this.loaderService.hide(id);
    }
  }

  openAddForm(editExpenseCategoryForm: TemplateRef<any>): void {
    this.formTitle.set('Add Expense Category Details');
    this.isEditMode.set(false);
    this.defaultValues.set({
      id: '',
      name: '',
      email: '',
      descrition: ''
    });
    this.bottomSheet.open(editExpenseCategoryForm);
  }

  private async edit(id: string, data: Partial<IExpensesCategory>) {
    const cleanData = { ...data, email: this.user?.email };
    delete cleanData.id;
    await updateDoc(
      doc(this.firestore, `${CONSTANTS.DB_PATH}/${id}`),
      cleanData
    );
  }

  private async add(data: Partial<IExpensesCategory>) {
    const cleanData = { ...data };
    delete cleanData.id;
    const docRef = await addDoc(
      collection(this.firestore, CONSTANTS.DB_PATH),
      cleanData
    );
    await setDoc(
      docRef,
      { ...cleanData, id: docRef.id, email: this.user?.email },
      { merge: true }
    );
  }
}
