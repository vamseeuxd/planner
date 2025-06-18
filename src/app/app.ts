import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PromptUpdateService } from './prompt-update.service';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, NavigationComponent],
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
