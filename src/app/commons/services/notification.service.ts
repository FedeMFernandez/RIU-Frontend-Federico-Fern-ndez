import { Injectable } from "@angular/core";
import Swal, { SweetAlertIcon, SweetAlertResult } from "sweetalert2";

@Injectable()
export class NotificationService {

  private readonly DefaultTitle: string = 'Aviso';
  private toast!: any;

  constructor() {
    this.toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast:any) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  }

  show(message: string, icon: 'success' | 'info' | 'warning' | 'error' = 'success'): void {
    this.toast.fire({
      icon,
      title: message,
    });
  }

  showInfo(message: string): void {
    this.dispatch(message, 'info');
  }

  showSuccess(message: string): void {
    this.dispatch(message, 'success', 'Operación exitosa');
  }

  showWarning(message: string): void {
    this.dispatch(message, 'warning', 'Alerta');
  }

  showError(message: string): void {
    this.dispatch(message, 'error', 'Error');
  }

  async showQuestion(message: string): Promise<boolean> {
    const result = await this.dispatchDialog(message);
    return Promise.resolve(result.isConfirmed);
  }

  private dispatch(message: string, icon: SweetAlertIcon, title: string = this.DefaultTitle): void {
    Swal.fire(title, message, icon);
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
