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
  comments: any[] = [];
  commentForms: { [key: number]: FormGroup } = {};
  registerForm!: FormGroup;
  registerForms: { [key: number]: FormGroup } = {};
  editMode: { [key: number]: boolean } = {};

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

  toggleLikeComment(commentId: number) {
    this.service.toggleLikeComment(commentId).subscribe(updatedComment => {
      this.publications.forEach(publication => {
        const comment = publication.comments.find((c: { id: number; }) => c.id === commentId);
        if (comment) {
          comment.likes = updatedComment.likes;
        }
      });
    });
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

        this.publications.forEach(publication => {
          this.service.getComments(publication.id).subscribe(
            (comments) => {
              publication.comments = comments;
              this.initializeForms(publication.comments);
            }
          );
        });
        this.initializeCommentForms();
      }
    )
  }

  initializeCommentForms() {
    this.publications.forEach(publication => {
      this.commentForms[publication.id] = this.fb.group({
        comment: ['', Validators.required]
      });
    });
  }

  initializeForms(comments: any[]) {
    comments.forEach(comment => {
      this.registerForms[comment.id] = this.fb.group({
        comment: [comment.comment, Validators.required]
      });
      this.editMode[comment.id] = false;
    });
  }


  submitPublications() {
    if (this.registerForm.valid) {
      this.service.createPublications(this.registerForm.value).subscribe(
        (response) => {
          console.log(response);
          this.publications.unshift(response); // Ajoute la nouvelle publication en tête de liste
          this.registerForm.reset(); // Réinitialise le formulaire
          this.commentForms[response.id] = this.fb.group({
            comment: ['', Validators.required]
          });
        }
      )
    }
  }

  deleteComment(commentId: number): any {
    this.service.deleteComment(commentId).subscribe(
      () => {
        console.log('Publication deleted successfully');

        this.publications.forEach(publication => {
          const index = publication.comments.findIndex((c: { id: number }) => c.id === commentId);
          if (index !== -1) {
            publication.comments.splice(index, 1);
          }
        });
      },
      (error) => {
        console.error('Error deleting publication', error);
      }
    );
  }

  getCustomerIdFromToken(): string | null {
    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
      const jwtPayload = jwtToken.split('.')[1]; // Récupère la partie du payload du JWT
      const decodedPayload = atob(jwtPayload); // Décodage du base64
      const payloadObj = JSON.parse(decodedPayload); // Conversion en objet JSON

      return payloadObj.customerId; // Renvoie customerId du payload
    }
    return null;
  }

  isCommentOfUser(commentId: number): boolean {
    const customerIdConnected = this.getCustomerIdFromToken();
    
    for (const publication of this.publications) {
      const comment = publication.comments.find((c: { id: number; customerId: string }) => c.id === commentId);
      if (comment) {
        return comment.customerId == customerIdConnected;
      }
    }
    
    return false;
  }

  submitComment(publicationId: number) {
    const commentForm = this.commentForms[publicationId];
    if (commentForm.valid) {
      this.service.commentPub(publicationId, commentForm.value).subscribe(
        (response) => {
          console.log(response);
          const publication = this.publications.find(p => p.id === publicationId);
          if (publication) {
            publication.comments = publication.comments.concat(response.comments);
            response.comments.forEach((comment: any) => {
              this.registerForms[comment.id] = this.fb.group({
                comment: ['', Validators.required]
              });
              this.editMode[comment.id] = false;
            });
            commentForm.reset();
          }
          
        }
      )
    }
  }

  updateComment(commentId: number) {
    const registerForm = this.registerForms[commentId];
    
    if (registerForm.valid) {
      this.service.updateComment(commentId, registerForm.value).subscribe(
        (response) => {
          console.log("HEEYYYYYY111" + response);
          
          this.publications.forEach(publication => {
            const comment = publication.comments.find((c: { id: number; }) => c.id === commentId);
            if (comment) {
              comment.comment = registerForm.value.comment; // Update the comment in the UI
            }
          });
          this.toggleText(commentId); // Hide the edit mode
        },
        (error) => {
          console.error('Error updating comment', error);
        }
      );
    }
  }

  toggleText(index: number) {
    this.editMode[index] = !this.editMode[index];
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
