import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RoutesRecognized,
} from '@angular/router';
import { AuthService } from '../auth/auth';
import { DialogService } from '../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    RouterModule,
  ],
})
export class NavigationComponent {
  title = 'Planner';
  router = inject(Router);
  authService = inject(AuthService);
  private dialogService = inject(DialogService);

  ngOnInit() {
    this.router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized) {
        const _data: any = data.state.root.firstChild?.data;
        this.title = _data.title;
      }
    });
  }

  logout() {
    const sub = this.dialogService
      .confirm({
        title: 'Logout Confirm',
        message: 'Are you sure you want to logout?',
        confirmText: 'Yes',
        cancelText: 'No',
      })
      .subscribe(async (result) => {
        if (result) {
          await this.authService.logout();
          this.router.navigate(['/login']);
        }
        sub.unsubscribe();
      });
  }
}
