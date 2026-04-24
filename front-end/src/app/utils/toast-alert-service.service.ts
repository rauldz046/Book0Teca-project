import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  // Garante que qualquer Swal abra acima de MatDialog / p-dialog / cdk-overlay
  private readonly Z_CLASS = {
    container: 'swal-on-top',
    popup:     'swal-on-top-popup',
    backdrop:  'swal-on-top-backdrop',
  };

  // Configuração padrão para Toasts
  private toastConfig = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: this.Z_CLASS,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  constructor() {}

  // --- 1. DIÁLOGOS DE CONFIRMAÇÃO DUPLA (Async) ---
  // Retorna Promise<boolean>
  async confirm(
    title: string, 
    text: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'warning',
    confirmButtonText: string = 'Confirmar',
    cancelButtonText: string = 'Cancelar'
  ): Promise<boolean> {
    
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: type as SweetAlertIcon,
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      confirmButtonColor: this.getColor(type),
      cancelButtonColor: '#6e7881',
      reverseButtons: true,
      customClass: this.Z_CLASS,
      allowOutsideClick: () => !Swal.isLoading()
    });

    return result.isConfirmed;
  }

  // --- CONFIRMAÇÃO COM VALIDAÇÃO ASYNC (Ex: Deletar via API) ---
  async confirmAsync(
    title: string,
    text: string,
    callback: () => Promise<any>,
    type: 'success' | 'error' | 'warning' = 'warning'
  ) {
    return Swal.fire({
      title: title,
      text: text,
      icon: type as SweetAlertIcon,
      showCancelButton: true,
      confirmButtonText: 'Sim, prosseguir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: this.getColor(type),
      customClass: this.Z_CLASS,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          return await callback(); // Executa sua função de API aqui
        } catch (error: any) {
          Swal.showValidationMessage(`Erro: ${error.message || 'Falha na operação'}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  }

  // --- 2. DIÁLOGOS DE INFORMAÇÃO (Somente OK) ---
  dialog(title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    return Swal.fire({
      title: title,
      text: message,
      icon: type as SweetAlertIcon,
      confirmButtonColor: this.getColor(type),
      confirmButtonText: 'OK',
      customClass: this.Z_CLASS,
    });
  }

  // Atalhos rápidos para diálogos
  success(title: string, message: string = '') { return this.dialog(title, message, 'success'); }
  error(title: string, message: string = '') { return this.dialog(title, message, 'error'); }
  info(title: string, message: string = '') { return this.dialog(title, message, 'info'); }

  // --- 3. TOASTS (Notificações Rápidas) ---
  toastSuccess(title: string) {
    this.toastConfig.fire({ icon: 'success', title: title });
  }

  toastError(title: string) {
    this.toastConfig.fire({ icon: 'error', title: title });
  }

  toastInfo(title: string) {
    this.toastConfig.fire({ icon: 'info', title: title });
  }

  toastWarning(title: string) {
    this.toastConfig.fire({ icon: 'warning', title: title });
  }

  // --- HELPERS ---
  private getColor(type: string): string {
    switch (type) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
      default: return '#3085d6';
    }
  }
}