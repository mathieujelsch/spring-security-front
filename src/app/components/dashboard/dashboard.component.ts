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

  toggleLike(publicationId: number) {
    this.service.toggleLike(publicationId).subscribe(updatedPublication => {
      const publication = this.publications.find(p => p.id === publicationId);
      if (publication) {
        publication.likes = updatedPublication.likes;
      }
    });
  }

  toggleDislike(publicationId: number) {
    this.service.toggleDislike(publicationId).subscribe(updatedPublication => {
      const publication = this.publications.find(p => p.id === publicationId);
      if (publication) {
        publication.dislikes = updatedPublication.dislikes;
      }
    });
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
    if (this.registerForm.valid) {
      this.service.createPublications(this.registerForm.value).subscribe(
        (response) => {
          console.log(response);
          this.publications.unshift(response); // Ajoute la nouvelle publication en tête de liste
          this.registerForm.reset(); // Réinitialise le formulaire
        }
      )
    }
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
