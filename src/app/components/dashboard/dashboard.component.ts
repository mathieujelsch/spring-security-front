import { Component } from '@angular/core';
import { JwtService } from '../../service/jwt.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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
    this.service.login(this.registerForm.value).subscribe(
      (response) => {
        console.log(response);
      }
    )
  }
}
