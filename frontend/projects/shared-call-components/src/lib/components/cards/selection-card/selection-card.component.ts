import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseCardComponent } from '../base-card/base-card.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
	selector: 'ov-selection-card',
	standalone: true,
	imports: [BaseCardComponent, MatSelectModule, MatFormFieldModule],
	templateUrl: './selection-card.component.html',
	styleUrl: './selection-card.component.scss'
})
export class SelectionCardComponent extends BaseCardComponent {
	@Input() options: { label: string; value: any }[] = [];
	@Input() selectedOption: any;
	@Output() onOptionSelected = new EventEmitter<any>();
	onSelectionChange(event: any) {
		this.onOptionSelected.emit(event.value);
	}
}
