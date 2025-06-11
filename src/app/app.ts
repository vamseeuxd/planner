import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PromptUpdateService } from './prompt-update.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  promptUpdateService = inject(PromptUpdateService);
  protected title = 'planner 0.2.0';
  constructor() {
    this.promptUpdateService.checkAndPromptForUpdate();
  }
}
