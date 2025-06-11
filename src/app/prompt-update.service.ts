import { Injectable } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PromptUpdateService {
  constructor(private swUpdate: SwUpdate) {}

  checkAndPromptForUpdate(): void {
    this.swUpdate.versionUpdates
      .pipe(filter((evt) => evt.type === 'VERSION_READY'))
      .subscribe((evt) => {
        // Check if the user should be prompted
        if (this.shouldPromptUser(evt)) {
          this.promptUserToUpdate(evt);
        }
      });
  }

  // Implement this function based on your app's requirements
  private shouldPromptUser(evt: any): boolean {
    //  Check browser capabilities, previous update attempts, etc.
    return true; // Example: Always prompt
  }

  private promptUserToUpdate(evt: any): void {
    if (confirm('New app version available. Reload to update?')) {
      this.activateUpdate();
    }
  }

  private activateUpdate(): void {
    this.swUpdate
      .activateUpdate()
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log('Error activating update', err);
      });
  }
}
