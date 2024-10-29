import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpService } from '../../../services';
import { Router } from '@angular/router';

@Component({
	selector: 'ov-login',
	standalone: true,
	imports: [
		MatFormFieldModule,
		ReactiveFormsModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
		MatCardModule,
		MatIconModule
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss'
})
export class ConsoleLoginComponent {
	loginForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private httpService: HttpService,
		private router: Router
	) {
		this.loginForm = this.fb.group({
			username: ['', [Validators.required, Validators.minLength(4)]],
			password: ['', [Validators.required, Validators.minLength(4)]]
		});
	}

	ngOnInit(): void {}

	async onSubmit() {
		if (this.loginForm.valid) {
			console.log(this.loginForm.value);
			// Lógica para manejar el inicio de sesión
			try {
				await this.httpService.adminLogin(this.loginForm.value);
				this.router.navigate(['console']);
			} catch (error) {
				console.log(error);
			}
		}
	}
}
