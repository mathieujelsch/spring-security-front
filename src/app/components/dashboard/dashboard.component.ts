import { Component } from '@angular/core';
import { JwtService } from '../../service/jwt.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  publications: any[] = [];
  registerForm!: FormGroup;

  constructor(
    private service: JwtService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.displayPublications();

    this.registerForm = this.fb.group({
      content: ['', Validators.required]
    })
  }

  displayPublications() {
    this.service.displayPublications().subscribe(
      (response) => {
        console.log(response);
        this.publications = response;
      }
    )
  }

  hasToken() {
    const jwtToken = localStorage.getItem('jwt');
    const response = !!jwtToken; // convertit en booléen
    console.log("Voici le résultat de displaymessage =" + response);
    return response;
  }


  isButtonDisabled(): boolean {
    return this.registerForm.invalid || !this.hasToken();
  } // cette fonction est utile si on veut disabled le bouton si on est pas connecter mais je prefere le message d'erreur

  submitPublications() {
    this.service.createPublications(this.registerForm.value).subscribe(
      (response) => {
        console.log(response);
      }
    )
  }
}
