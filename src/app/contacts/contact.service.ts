import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, Subject, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  private baseUrl = 'https://full-stack-development-d06db-default-rtdb.firebaseio.com/';
  contactListChangedEvent = new Subject<Contact[]>();
  private contacts: Contact[] = [];

  constructor(private http: HttpClient) { }

  private sortAndSend() {
    this.contacts.sort((a, b) => a.name.localeCompare(b.name));
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<{ message: string; contacts: Contact[] }>('http://localhost:3000/contacts').pipe(
      map((response) => {
        const contacts = response.contacts ?? [];
        this.contacts = contacts;
        this.sortAndSend();
        return this.contacts;
      }),
      catchError((error) => {
        console.error('Error fetching contacts:', error);
        return of([]);
      })
    );
  }

  getContact(id: string): Observable<Contact> {
    return this.http.get<Contact>(`http://localhost:3000/contacts/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching contact:', error);
        return of(null);
      })
    );
  }

  addContact(contact: Contact) {
    if (!contact || !contact.name || !contact.email) {
      console.error("Name and Email are required!");
      return of(null); // Return an observable to avoid errors
    }
    contact.id = ''; // Make sure id is empty
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.post<{ message: string, contact: Contact }>(
      'http://localhost:3000/contacts', contact, { headers }
    ).pipe(
      tap(responseData => {
        this.contacts.push(responseData.contact);
        this.sortAndSend();
        this.storeContacts(); // Ensure data is updated in Firebase
      }),
      catchError(error => {
        console.error('Error adding contact:', error);
        return throwError(() => error);
      })
    );
  }
  

  updateContact(originalContact: Contact, newContact: Contact): Observable<void> {
    if (!originalContact || !newContact) {
      return of(); // Return an observable of void if no valid contacts
    }
  
    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) {
      return of(); // Return an observable of void if the contact is not found
    }
  
    newContact.id = originalContact.id;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    // Return the observable from the http.put request
    return this.http.put<void>(`http://localhost:3000/contacts/${originalContact.id}`, newContact, { headers });
  }
  

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) {
      return;
    }

    this.http.delete(`http://localhost:3000/contacts/${contact.id}`).subscribe({
      next: () => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
        this.storeContacts(); // Ensure data is updated in Firebase
      },
      error: (error) => {
        console.error('Error deleting contact:', error);
      }
    });
  }

  storeContacts() {
    const contacts = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(`${this.baseUrl}contacts.json`, contacts, { headers })
      .subscribe({
        next: () => {
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error: (error) => {
          console.error('Error storing contacts:', error);
        }
      });
  }
}
