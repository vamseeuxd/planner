import { Component, TemplateRef, inject, signal, computed } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { DialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { LoaderService } from '../confirmation-dialog/loader.service';

// Constants for hardcoded values
const CONSTANTS = {
  DB_PATH: '/expenses',
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
interface IExpense {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  settledDate: string;
}

@Component({
  selector: 'app-expenses',
  standalone: true,
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
  template: `
    <div class="mat-elevation-z2 py-4 px-8 mx-12 my-8">
      <h3 class="m-0 p-0 mb-5 h-box w-100 month-title">
        Month : {{ constants.MONTH_DISPLAY }}
      </h3>
      <h3 class="m-0 p-0 mb-5 h-box due-total">
        Due ({{ constants.DEFAULT_COUNT }}) Amount<span class="ms-auto">
          : {{ constants.DEFAULT_AMOUNT | currency : constants.CURRENCY }}</span>
      </h3>
      <h3 class="m-0 p-0 mb-5 h-box paid-total">
        Paid ({{ constants.DEFAULT_COUNT }}) Amount<span class="ms-auto">
          : {{ constants.DEFAULT_AMOUNT | currency : constants.CURRENCY }}</span>
      </h3>
      <h3 class="m-0 p-0 mb-5 h-box total-amount">
        Total Amount<span class="ms-auto">
          : {{ constants.DEFAULT_AMOUNT | currency : constants.CURRENCY }}</span>
      </h3>
    </div>
    <mat-list role="list" class="mx-3 expnses-list">
      @for (item of expenses(); track item.id) {
        <mat-list-item role="listitem" class="expnses-list-item border-bottom">
          <div class="h-box w-100">
            <div class="v-box w-100">
              <span class="fs-12 mt-8">{{ item.name }}</span>
              <div class="v-box w-100 mb-8">
                <span class="fs-8 mt-3 mb-3 due">DUE : {{ item.dueDate | date : 'dd-MMM-yyyy' }}</span>
                <span class="fs-8 mt-3 paid">PAID : {{ item.settledDate | date : 'dd-MMM-yyyy' }}</span>
              </div>
            </div>
            <div class="ms-auto fs-12 total">
              {{ item.amount | currency : constants.CURRENCY }}
            </div>
            <mat-icon [matMenuTriggerFor]="menu">more_vert</mat-icon>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="openEditForm(editForm, item)">
                <mat-icon>edit</mat-icon>
                <span>Edit</span>
              </button>
              <button mat-menu-item (click)="deleteExpense(item)">
                <mat-icon>delete</mat-icon>
                <span>Delete</span>
              </button>
              <button mat-menu-item (click)="openCloneForm(editForm, item)">
                <mat-icon>file_copy</mat-icon>
                <span>Clone</span>
              </button>
            </mat-menu>
          </div>
        </mat-list-item>
      } @empty {
        <li>There are no items.</li>
      }
    </mat-list>

    <div class="h-box w-100 mt-10 mb-5 mx-3">
      <button matButton class="me-auto ms-10" (click)="openAddForm(editForm)">
        <mat-icon>add</mat-icon>
        Add
      </button>
      <mat-menu #filterList="matMenu">
        <div mat-menu-item class="me-8 border-bottom">
          <mat-checkbox>Pending</mat-checkbox>
        </div>
        <div mat-menu-item class="me-8">
          <mat-checkbox>Settled</mat-checkbox>
        </div>
      </mat-menu>
      <button matButton [matMenuTriggerFor]="filterList" class="ms-auto me-10">
        Filters <mat-icon>filter_list</mat-icon>
      </button>
    </div>

    <ng-template #editForm>
      <h3 class="p-0 form-title">
        {{ formTitle() }}
      </h3>
      <form #editExpenseForm="ngForm" autocomplete="off" class="v-box p-5">
        <mat-form-field appearance="outline" class="w-100 mb-10">
          <mat-label>Expense Title</mat-label>
          <input matInput required [(ngModel)]="defaultValues().name" name="name" type="text" placeholder="Expense Title"/>
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-100 mb-10">
          <mat-label>Expense Due Date</mat-label>
          <input matInput required type="date" [(ngModel)]="defaultValues().dueDate" name="dueDate" placeholder="Expense Due Date"/>
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-100 mb-10">
          <mat-label>Expense Settled Date</mat-label>
          <input matInput required type="date" [(ngModel)]="defaultValues().settledDate" name="settledDate" placeholder="Expense Settled Date"/>
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-100 mb-10">
          <mat-label>Expense Amount</mat-label>
          <input matInput required type="number" [(ngModel)]="defaultValues().amount" name="amount" placeholder="Expense Amount"/>
        </mat-form-field>
        <div class="h-box w-100 mt-10">
          <button mat-raised-button class="w-50" (click)="editExpenseForm.resetForm({}); bottomSheet.dismiss()">Close</button>
          <button mat-raised-button class="ms-10 w-50" [disabled]="editExpenseForm.invalid" color="primary" (click)="save(editExpenseForm)">Save</button>
        </div>
      </form>
    </ng-template>
  `,
  styleUrl: './expenses.scss',
})
export class ExpensesComponent {
  // Injected services
  dialogService = inject(DialogService);
  bottomSheet = inject(MatBottomSheet);
  firestore = inject(Firestore);
  loaderService = inject(LoaderService);
  snackBar = inject(MatSnackBar);

  // Signals for reactive state
  expenses = signal<IExpense[]>([]);
  formTitle = signal('Edit Expense Details');
  isEditMode = signal(false);
  defaultValues = signal<IExpense>({
    id: '',
    name: '',
    amount: 0,
    dueDate: '',
    settledDate: '',
  });
  constants = CONSTANTS;

  constructor() {
    // Initialize data fetch
    this.fetchExpenses();
  }

  private async fetchExpenses() {
    const id = this.loaderService.show();
    try {
      const expensesCollection = collection(this.firestore, CONSTANTS.DB_PATH);
      collectionData(expensesCollection, { idField: 'id' }).subscribe((data) => {
        this.expenses.set(data as IExpense[]);
        this.loaderService.hide(id);
      });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      this.loaderService.hide(id);
    }
  }

  deleteExpense(expense: IExpense) {
    this.dialogService
      .confirm({
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this expense?',
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
              console.error('Error deleting expense:', error);
              this.snackBar.open('Error deleting expense', 'Close', {
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

  openCloneForm(editForm: TemplateRef<any>, data: IExpense): void {
    this.formTitle.set('Add Expense Details');
    this.isEditMode.set(false);
    this.defaultValues.set({ ...data });
    this.bottomSheet.open(editForm);
  }

  openEditForm(editForm: TemplateRef<any>, data: IExpense): void {
    this.formTitle.set('Edit Expense Details');
    this.isEditMode.set(true);
    this.defaultValues.set({ ...data });
    this.bottomSheet.open(editForm);
  }

  openAddForm(editForm: TemplateRef<any>): void {
    this.formTitle.set('Add Expense Details');
    this.isEditMode.set(false);
    this.defaultValues.set({
      id: '',
      name: '',
      amount: 0,
      dueDate: '',
      settledDate: '',
    });
    this.bottomSheet.open(editForm);
  }

  async save(editExpenseForm: NgForm) {
    const id = this.loaderService.show();
    try {
      const formValue = editExpenseForm.value;
      if (this.isEditMode()) {
        await this.edit(this.defaultValues().id, formValue);
        this.snackBar.open('Expense updated successfully', 'Close', {
          duration: CONSTANTS.SNACKBAR_DURATION,
          panelClass: CONSTANTS.SNACKBAR_SUCCESS_CLASS,
        });
      } else {
        await this.add(formValue);
        this.snackBar.open('Expense added successfully', 'Close', {
          duration: CONSTANTS.SNACKBAR_DURATION,
          panelClass: CONSTANTS.SNACKBAR_SUCCESS_CLASS,
        });
      }
      editExpenseForm.resetForm({});
      this.bottomSheet.dismiss();
    } catch (error) {
      console.error('Error saving expense:', error);
      this.snackBar.open('Error saving expense', 'Close', {
        duration: CONSTANTS.SNACKBAR_DURATION,
        panelClass: CONSTANTS.SNACKBAR_ERROR_CLASS,
      });
    } finally {
      this.loaderService.hide(id);
    }
  }

  private async add(data: Partial<IExpense>) {
    const cleanData = { ...data };
    delete cleanData.id;
    const docRef = await addDoc(collection(this.firestore, CONSTANTS.DB_PATH), cleanData);
    await setDoc(docRef, { ...cleanData, id: docRef.id });
  }

  private async edit(id: string, data: Partial<IExpense>) {
    const cleanData = { ...data };
    delete cleanData.id;
    await updateDoc(doc(this.firestore, `${CONSTANTS.DB_PATH}/${id}`), cleanData);
  }

  private async delete(id: string) {
    await deleteDoc(doc(this.firestore, `${CONSTANTS.DB_PATH}/${id}`));
  }
}
