import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'ov-dialog',
	standalone: true,
	imports: [MatButtonModule, MatDialogActions, MatDialogContent],
	template: `<h2 mat-dialog-title>Delete file</h2>
		<mat-dialog-content> Would you like to delete? </mat-dialog-content>
		<mat-dialog-actions>
			<button mat-button mat-dialog-close (click)="close()">No</button>
			<button mat-button mat-dialog-close cdkFocusInitial (click)="close()">Ok</button>
		</mat-dialog-actions>`,
	styleUrl: './dialog.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent {
	readonly dialogRef = inject(MatDialogRef<DialogComponent>);

	close(): void {
		this.dialogRef.close();
	}
}
