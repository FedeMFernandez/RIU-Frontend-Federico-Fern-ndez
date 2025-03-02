import { Injectable } from "@angular/core";
import Swal, { SweetAlertResult } from "sweetalert2";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {

  private toast!: any;

  constructor() {
    this.toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }

  async show(message: string, icon: 'success' | 'info' | 'warning' | 'error' = 'success'): Promise<void> {
    await this.toast.fire({
      icon,
      title: message,
    });
  }

  async showQuestion(message: string): Promise<boolean> {
    const result = await this.dispatchDialog(message);
    return Promise.resolve(result.isConfirmed);
  }

  private async dispatchDialog(message: string): Promise<SweetAlertResult> {
    return await Swal.fire({
      title: 'Atención',
      text: message,
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#ba1a1a',
      confirmButtonColor: '#005cbb',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar',
    });
  }
}
