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

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss',
})
export class App {
  promptUpdateService = inject(PromptUpdateService);
  protected title = 'planner 0.2.0';
  constructor() {
    this.promptUpdateService.checkAndPromptForUpdate();
  }
}
