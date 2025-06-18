import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from './confirmation-dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog: MatDialog = inject(MatDialog);

  confirm(data: ConfirmationDialogData): Observable<boolean> {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        width: '400px',
        data,
        disableClose: true,
      })
      .afterClosed();
  }
}
