import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public getItem(key: string): string {
    return JSON.parse(localStorage.getItem(key));
  }

  public setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  public clearStorage(): void {
    localStorage.clear()
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key)
  }
}
