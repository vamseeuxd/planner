import { Component, TemplateRef, inject, signal, computed } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc, setDoc, Timestamp, query, where } from '@angular/fire/firestore';
import { DialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { LoaderService } from '../confirmation-dialog/loader.service';
import { AuthService } from '../auth/auth';
import { User } from '@angular/fire/auth';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {ProgressBarMode, MatProgressBarModule} from '@angular/material/progress-bar';

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
  email: string;
  amount: number;
  dueDate: Timestamp | string; // Can be Timestamp from Firestore or string in form
  settledDate: Timestamp | string | null; // Can be Timestamp from Firestore or string in form
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
    MatDatepickerModule,
    MatProgressBarModule,
  ],
  providers: [provideNativeDateAdapter()],
  styleUrl: './expenses.scss',
  templateUrl: './expenses.html',
})
export class ExpensesComponent {
  // Injected services
  dialogService = inject(DialogService);
  bottomSheet = inject(MatBottomSheet);
  firestore = inject(Firestore);
  loaderService = inject(LoaderService);
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);

  // Signals for reactive state
  expenses = signal<IExpense[]>([]);
  formTitle = signal('Edit Expense Details');
  isEditMode = signal(false);
  showPending = signal(true);
  showSettled = signal(true);
  mode: ProgressBarMode = 'buffer';
  
  // Progress bar values computed from expense amounts
  value = computed(() => {
    const total = this.totalAmount();
    return total > 0 ? (this.totalSettledAmount() / total) * 100 : 0;
  });
  
  bufferValue = computed(() => {
    const total = this.totalAmount();
    return total > 0 ? 100 : 0;
  });
  defaultValues = signal<IExpense>({
    id: '',
    name: '',
    amount: 0,
    dueDate: '',
    settledDate: '',
    email: ''
  });
  constants = CONSTANTS;
  
  // Amount signals
  totalDueAmount = computed(() => {
    return this.expenses()
      .filter(expense => !expense.settledDate || (typeof expense.settledDate === 'string' && expense.settledDate.trim() === ''))
      .reduce((sum, expense) => sum + expense.amount, 0);
  });
  
  totalSettledAmount = computed(() => {
    return this.expenses()
      .filter(expense => expense.settledDate && (typeof expense.settledDate !== 'string' || expense.settledDate.trim() !== ''))
      .reduce((sum, expense) => sum + expense.amount, 0);
  });
  
  totalAmount = computed(() => {
    return this.totalDueAmount() + this.totalSettledAmount();
  });

  // Computed signal for filtered expenses
  filteredExpenses = computed(() => {
    return this.expenses().filter(expense => {
      const isPending = !expense.settledDate || (typeof expense.settledDate === 'string' && expense.settledDate.trim() === '');
      const isSettled = expense.settledDate && (typeof expense.settledDate !== 'string' || expense.settledDate.trim() !== '');

      if (this.showPending() && isPending) return true;
      if (this.showSettled() && isSettled) return true;

      return false;
    });
  });
  user: User | undefined;
  selectedMonth = signal(new Date());

  constructor() {
    // Initialize data fetch
    this.authService.user$.subscribe(user => {
      if (!user) {
        this.snackBar.open('Please log in to view expenses', 'Close', {
          duration: CONSTANTS.SNACKBAR_DURATION,
          panelClass: CONSTANTS.SNACKBAR_ERROR_CLASS,
        });
      } else {
        this.user = user;
        // Fetch expenses when user is authenticated
        this.fetchExpenses();
      }
    });
  }

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<any>) {
    console.log(normalizedMonthAndYear.getFullYear(), normalizedMonthAndYear.getMonth());
    console.log(normalizedMonthAndYear.toLocaleString('en-US', { month: 'short', year: 'numeric' }));
    this.selectedMonth.set(normalizedMonthAndYear);
    datepicker.close();
    // Fetch expenses for the newly selected month
    this.fetchExpenses();
  }

  goToNextMonth() {
    const currentMonth = new Date(this.selectedMonth());
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    this.selectedMonth.set(nextMonth);
    this.fetchExpenses();
  }

  goToPreviousMonth() {
    const currentMonth = new Date(this.selectedMonth());
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    this.selectedMonth.set(previousMonth);
    this.fetchExpenses();
  }

  getData(date: Timestamp | string){
    if (typeof date === 'string') {
      return date;
    } else if(date && typeof date === 'object' && 'seconds' in date) {
      return (date as Timestamp).seconds * 1000; // Convert Firestore Timestamp to milliseconds
    }
    return null;
  }

  async fetchExpenses() {
    const id = this.loaderService.show();
    try {
      // Get the first day of the selected month
      const startDate = new Date(this.selectedMonth().getFullYear(), this.selectedMonth().getMonth(), 1);
      // Get the first day of the next month
      const endDate = new Date(this.selectedMonth().getFullYear(), this.selectedMonth().getMonth() + 1, 1);
      
      // Convert to Firestore Timestamps
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);
      
      const expensesCollection = collection(this.firestore, CONSTANTS.DB_PATH);
      
      // Query expenses for the selected month and user email
      const q = query(
        expensesCollection,
        where('email', '==', this.user?.email),
        where('dueDate', '>=', startTimestamp),
        where('dueDate', '<', endTimestamp)
      );
      
      collectionData(q, { idField: 'id' }).subscribe((data) => {
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

    // Convert Timestamp to string date format for the form
    const formData = { ...data };
    if (formData.dueDate && typeof formData.dueDate !== 'string') {
      formData.dueDate = formData.dueDate.toDate().toISOString().split('T')[0];
    }

    if (formData.settledDate && typeof formData.settledDate !== 'string') {
      formData.settledDate = formData.settledDate.toDate().toISOString().split('T')[0];
    }

    this.defaultValues.set(formData);
    this.bottomSheet.open(editForm);
  }

  openEditForm(editForm: TemplateRef<any>, data: IExpense): void {
    this.formTitle.set('Edit Expense Details');
    this.isEditMode.set(true);

    // Convert Timestamp to string date format for the form
    const formData = { ...data };
    if (formData.dueDate && typeof formData.dueDate !== 'string') {
      formData.dueDate = formData.dueDate.toDate().toISOString().split('T')[0];
    }

    if (formData.settledDate && typeof formData.settledDate !== 'string') {
      formData.settledDate = formData.settledDate.toDate().toISOString().split('T')[0];
    }

    this.defaultValues.set(formData);
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
      email: ''
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

    // Convert string dates to Firestore Timestamp objects
    if (cleanData.dueDate && typeof cleanData.dueDate === 'string') {
      cleanData.dueDate = Timestamp.fromDate(new Date(cleanData.dueDate));
    }

    if (cleanData.settledDate && typeof cleanData.settledDate === 'string' && cleanData.settledDate.trim() !== '') {
      cleanData.settledDate = Timestamp.fromDate(new Date(cleanData.settledDate));
    } else if (!cleanData.settledDate || (typeof cleanData.settledDate === 'string' && cleanData.settledDate.trim() === '')) {
      delete cleanData.settledDate;
    }

    const docRef = await addDoc(collection(this.firestore, CONSTANTS.DB_PATH), cleanData);
    await setDoc(docRef, { ...cleanData, id: docRef.id, email: this.user?.email }, { merge: true });
  }

  private async edit(id: string, data: Partial<IExpense>) {
    const cleanData = { ...data, email: this.user?.email };
    delete cleanData.id;

    // Convert string dates to Firestore Timestamp objects
    if (cleanData.dueDate && typeof cleanData.dueDate === 'string') {
      cleanData.dueDate = Timestamp.fromDate(new Date(cleanData.dueDate));
    }

    if (cleanData.settledDate && typeof cleanData.settledDate === 'string' && cleanData.settledDate.trim() !== '') {
      cleanData.settledDate = Timestamp.fromDate(new Date(cleanData.settledDate));
    } else if (!cleanData.settledDate || (typeof cleanData.settledDate === 'string' && cleanData.settledDate.trim() === '')) {
      // Set to null explicitly to update the field in Firestore when it's empty
      cleanData.settledDate = null;
    }

    await updateDoc(doc(this.firestore, `${CONSTANTS.DB_PATH}/${id}`), cleanData);
  }

  private async delete(id: string) {
    await deleteDoc(doc(this.firestore, `${CONSTANTS.DB_PATH}/${id}`));
  }
}
