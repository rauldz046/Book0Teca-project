import { Component, inject, Inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// --- INTERFACE DE DADOS ---
export interface ToastData {
  type: 'success' | 'danger' | 'info';
  title: string;
  message: string;
}

// --- COMPONENTE INTERNO (Mini-Dialog) ---
// ... (mantenha os imports anteriores)

@Component({
  selector: 'app-toast-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="mini-dialog" [ngClass]="data.type">
      <div class="header">
        <mat-icon
          ><i [className]="getIcon()" style="font-size: 2rem"></i
        ></mat-icon>
        <span>{{ data.title }}</span>
      </div>
      <div mat-dialog-content>
        <p>{{ data.message }}</p>
      </div>
      <div mat-dialog-actions align="end">
        <button mat-button (click)="ref.close(false)">CANCELAR</button>
        <button mat-raised-button color="primary" (click)="ref.close(true)">
          CONFIRMAR
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .mini-dialog {
        padding: 8px;
      }
      .header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: bold;
        font-size: 1.1rem;
        margin-bottom: 12px;
      }
      .success {
        color: #2e7d32;
      }
      .danger {
        color: #d32f2f;
      }
      .info {
        color: #0288d1;
      }
      p {
        color: #444;
        margin-bottom: 20px;
      }
      button {
        font-weight: bold;
      }
    `,
  ],
})
class ToastDialogComponent {
  constructor(
    public ref: MatDialogRef<ToastDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ToastData,
  ) {}

  getIcon() {
    switch (this.data.type) {
      case 'success':
        return 'pi pi-check-circle';
      case 'danger':
        return 'pi pi-exclamation-triangle';
      case 'info':
        return 'pi pi-info-circle';
      default:
        return 'pi pi-bell';
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  // Método mestre que todos os outros vão usar
  private openDialog(type: 'success' | 'danger' | 'info', title: string, message: string) {
    const dialogRef = this.dialog.open(ToastDialogComponent, {
      width: '380px',
      data: { type, title, message },
      disableClose: true,
    });
    return dialogRef.afterClosed(); // <--- Isso retorna o Observable (true ou false)
  }

  // Agora suas funções retornam o resultado do diálogo
  confirm(type: 'success' | 'danger' | 'info', title: string, message: string) {
    return this.openDialog(type, title, message);
  }

  dialogErro(title: string, message: string) {
    return this.openDialog('danger', title, message);
  }

  dialogInfo(title: string, message: string) {
    return this.openDialog('info', title, message);
  }

  dialogSuccess(title: string, message: string) {
    return this.openDialog('success', title, message);
  }

  toastSuccess(title: string) {
    this.snackBar.open(title, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  toastDanger(title: string) {
    this.snackBar.open(title, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['danger-snackbar'],
    });
  }

  toastInfo() {
    this.snackBar.open('Informação', 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['info-snackbar'],
    });
  }
}
