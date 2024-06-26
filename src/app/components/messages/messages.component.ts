import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { JwtService } from '../../service/jwt.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {

  publications: any[] = [];
  registerForm!: FormGroup;
  registerForms: FormGroup[] = [];
  toggle: boolean = false;
  editMode: boolean[] = [];
  loading: boolean = true;

  constructor(
    private service: JwtService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.displayMessages();

    this.registerForm = this.fb.group({
      content: ['', Validators.required]
    })
  }

  displayMessages() {
    this.service.displayMessages().subscribe(
      (response) => {
        console.log(response);
        this.publications = response;
        this.initializeForms();
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      },
      (error) => {
        console.error('Error fetching publications', error);
        this.loading = false; // Arrêter le chargement en cas d'erreur
      }
    )
  }

  initializeForms() {
    this.publications.forEach((publication, index) => {
      this.registerForms[index] = this.fb.group({
        content: [publication.content, Validators.required]
      });
      this.editMode[index] = false;
    });
  }

  isConnected(): boolean {
    const jwtToken = localStorage.getItem('jwt');

    if (jwtToken) {
      return true;
    } else {
      return false;
    }
  }

  deletePublication(publicationId: number): void {
    this.service.deletePublication(publicationId).subscribe(
      () => {
        console.log('Publication deleted successfully');
        this.displayMessages(); // Refresh the list after deletion
      },
      (error) => {
        console.error('Error deleting publication', error);
      }
    );
  }

  updatePublications(publicationId: number, index: number) {
    if (this.registerForms[index].valid) {
      this.service.updatePublication(publicationId, this.registerForms[index].value).subscribe(
        (response) => {
          console.log(response);
          this.publications[index] = response; // Update the publication in the list
          this.editMode[index] = false; // Exit edit mode
        }
      );
    }
  }


  toggleText(index: number) {
    this.editMode[index] = !this.editMode[index];
  }
}
