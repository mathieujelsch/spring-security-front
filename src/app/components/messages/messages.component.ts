import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { JwtService } from '../../service/jwt.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {

  publications: any[] = [];

  constructor(
    private service: JwtService,
  ) { }

  ngOnInit() {
    this.displayMessages();
  }

  displayMessages() {
    this.service.displayMessages().subscribe(
      (response) => {
        console.log(response);
        this.publications = response;
      }
    )
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
}
