import { Component } from '@angular/core';
import { JwtService } from '../../service/jwt.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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

  submitPublications() {
    this.service.createPublications(this.registerForm.value).subscribe(
      (response) => {
        console.log(response);
      }
    )
  }

  // likePublication(publicationId: number) {
  //   this.service.likePublication(publicationId).subscribe(
  //     response => {
  //       console.log('Like added successfully', response);
  //       // Actualisez l'affichage ou effectuez d'autres actions nécessaires
  //     }
  //   ) 
  // }

  likePublication(publicationId: number, customerId: number): void {
    this.service.toggleLike(publicationId, customerId).subscribe(
      response => {
        console.log('Like toggled successfully', response);
        // Handle successful response, perhaps update the UI
      },
      error => {
        console.error('Error toggling like', error);
        // Handle error response
      }
    );
  }

  hasToken() {
    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
      return true;
    } else {
      return false;
    }
  }

  onSubmit() {

  }
}
