import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  loaders: number[] = [];
  loadersAction: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(
    this.loaders
  );
  loaders$ = this.loadersAction.asObservable();
  show() {
    const id = Math.random();
    this.loaders.push(id);
    this.loadersAction.next(this.loaders);
    return id;
  }
  hide(id: number) {
    const index = this.loaders.indexOf(id);
    if (index > -1) {
      this.loaders.splice(index, 1);
      this.loadersAction.next(this.loaders);
    }
  }
}
