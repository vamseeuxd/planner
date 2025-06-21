import { CommonModule } from '@angular/common';
import { Component, inject, signal, TemplateRef } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Firestore, collection, query, where, collectionData, deleteDoc, doc, updateDoc, addDoc, setDoc } from '@angular/fire/firestore';
import { FormsModule, NgForm } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth';
import { DialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { LoaderService } from '../confirmation-dialog/loader.service';

// Constants for hardcoded values
const CONSTANTS = {
  DB_PATH: '/incomes-categories',
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

// Interface for Income
interface IIncomesCategory {
  id: string;
  name: string;
  descrition: string;
  email: string;
}

@Component({
  selector: 'app-incomes-categories',
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
  templateUrl: './incomes-categories.html',
  styleUrl: './incomes-categories.scss'
})
export class IncomesCategories {
  // Injected services
  dialogService = inject(DialogService);
  bottomSheet = inject(MatBottomSheet);
  firestore = inject(Firestore);
  loaderService = inject(LoaderService);
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);

  // Signals for reactive state
  incomesCategories = signal<IIncomesCategory[]>([]);
  formTitle = signal('Edit Incomes Category Details');
  isEditMode = signal(false);
  user: User | undefined;
  defaultValues = signal<IIncomesCategory>({
    id: '',
    name: '',
    descrition: '',
    email: '',
  });

  constructor() {
    // Initialize data fetch
    this.authService.user$.subscribe((user) => {
      if (!user) {
        this.snackBar.open('Please log in to view Incomes Category', 'Close', {
          duration: CONSTANTS.SNACKBAR_DURATION,
          panelClass: CONSTANTS.SNACKBAR_ERROR_CLASS,
        });
      } else {
        this.user = user;
        // Fetch incomes when user is authenticated
        this.fetchIncomesCategories();
      }
    });
  }

  async fetchIncomesCategories() {
    const id = this.loaderService.show();
    try {
      const incomesCollection = collection(this.firestore, CONSTANTS.DB_PATH);
      // Query incomes for the selected month and user email
      const q = query(
        incomesCollection,
        where('email', '==', this.user?.email)
      );
      collectionData(q, { idField: 'id' }).subscribe((data) => {
        this.incomesCategories.set(data as IIncomesCategory[]);
        this.loaderService.hide(id);
      });
    } catch (error) {
      console.error('Error fetching Incomes Category:', error);
      this.loaderService.hide(id);
    }
  }

  openEditForm(editIncomeCategoryForm: TemplateRef<any>, data: IIncomesCategory): void {
    this.formTitle.set('Edit Income Category Details');
    this.isEditMode.set(true);
    const formData = { ...data };
    this.defaultValues.set(formData);
    this.bottomSheet.open(editIncomeCategoryForm);
  }

  deleteIncome(income: IIncomesCategory) {
    this.dialogService
      .confirm({
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this Income Category?',
        confirmText: 'Yes',
        cancelText: 'No',
      })
      .subscribe({
        next: async (result) => {
          if (result) {
            const id = this.loaderService.show();
            try {
              await this.delete(income.id);
              this.snackBar.open('Income deleted successfully', 'Close', {
                duration: CONSTANTS.SNACKBAR_DURATION,
                panelClass: CONSTANTS.SNACKBAR_SUCCESS_CLASS,
              });
            } catch (error) {
              console.error('Error deleting Income Category:', error);
              this.snackBar.open('Error deleting Income Category', 'Close', {
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

  async save(editIncomeCategoryForm: NgForm) {
    const id = this.loaderService.show();
    try {
      const formValue = editIncomeCategoryForm.value;
      if (this.isEditMode()) {
        await this.edit(this.defaultValues().id, formValue);
        this.snackBar.open('Income Category updated successfully', 'Close', {
          duration: CONSTANTS.SNACKBAR_DURATION,
          panelClass: CONSTANTS.SNACKBAR_SUCCESS_CLASS,
        });
      } else {
        await this.add(formValue);
        this.snackBar.open('Income Category added successfully', 'Close', {
          duration: CONSTANTS.SNACKBAR_DURATION,
          panelClass: CONSTANTS.SNACKBAR_SUCCESS_CLASS,
        });
      }
      editIncomeCategoryForm.resetForm({});
      this.bottomSheet.dismiss();
    } catch (error) {
      console.error('Error saving Income Category:', error);
      this.snackBar.open('Error saving Income Category', 'Close', {
        duration: CONSTANTS.SNACKBAR_DURATION,
        panelClass: CONSTANTS.SNACKBAR_ERROR_CLASS,
      });
    } finally {
      this.loaderService.hide(id);
    }
  }

  openAddForm(editIncomeCategoryForm: TemplateRef<any>): void {
    this.formTitle.set('Add Income Category Details');
    this.isEditMode.set(false);
    this.defaultValues.set({
      id: '',
      name: '',
      email: '',
      descrition: ''
    });
    this.bottomSheet.open(editIncomeCategoryForm);
  }

  private async edit(id: string, data: Partial<IIncomesCategory>) {
    const cleanData = { ...data, email: this.user?.email };
    delete cleanData.id;
    await updateDoc(
      doc(this.firestore, `${CONSTANTS.DB_PATH}/${id}`),
      cleanData
    );
  }

  private async add(data: Partial<IIncomesCategory>) {
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
