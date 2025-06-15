import {
  ChangeDetectionStrategy,
  signal,
  Component,
  inject,
} from '@angular/core';
import { PromptUpdateService } from './prompt-update.service';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from './navigation/navigation.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatListModule,
    MatSlideToggleModule,
    NavigationComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss',
})
export class App {
  airplaneMode = false;
  promptUpdateService = inject(PromptUpdateService);
  protected title = 'planner 0.2.0';
  constructor() {
    this.promptUpdateService.checkAndPromptForUpdate();
  }
}
