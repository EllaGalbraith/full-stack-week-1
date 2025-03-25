import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log('Params:', params);

      // If there's no ID in the params, it's a new contact
      if (!params['id']) {
        this.editMode = false;
        this.contact = new Contact('', '', '', '', '', []); // Initialize with empty values
        console.log('New Contact Initialized:', this.contact);
        return;
      }

      // Fetch the contact if editing
      this.contactService.getContact(params['id']).subscribe({
        next: (contact: Contact) => {
          console.log('Fetched Contact:', contact);
          if (!contact) {
            console.error('Contact not found');
            return;
          }
          this.editMode = true;
          this.originalContact = contact;
          this.contact = { ...contact }; // Shallow copy to preserve originalContact
          console.log('Contact Set in Edit Mode:', this.contact);
        },
        error: (err) => {
          console.error('Error fetching contact:', err);
        }
      });
    });
  }

  // onSubmit method now uses NgForm for form validation and submission
  onSubmit(form: NgForm) {
    console.log('Form data:', form.value); // Log form data to see what is being submitted
    const value = form.value; // Get form data
  
    // Ensure that all required fields are filled
    if (!value.name || !value.email) {
      console.error('Name and Email are required!');
      return;
    }
  
    const newContact = new Contact(value.id, value.name, value.email, value.phone, value.imageUrl, value.group);
  
    if (this.editMode) {
      // Update existing contact
      this.contactService.updateContact(this.originalContact, newContact).subscribe({
        next: () => {
          this.router.navigate(['/contacts']);
        },
        error: (err) => {
          console.error('Error updating contact:', err);
        }
      });
    } else {
      // Create new contact
      this.contactService.addContact(newContact).subscribe({
        next: () => {
          this.router.navigate(['/contacts']);
        },
        error: (err) => {
          console.error('Error creating contact:', err);
        }
      });
    }
  }
  

  // Cancel method to navigate back to the contacts list
  onCancel() {
    this.router.navigate(['/contacts']);
  }

  // Handle the drop event for adding contacts to groups
  onDrop(event: CdkDragDrop<Contact[]>) {
    const selectedContact: Contact = event.item.data;

    // Check if the contact is invalid for the group
    if (this.isInvalidContact(selectedContact)) {
      console.error('This contact is invalid for the group');
      return; // Do not add to the group if invalid
    }

    // Add the selected contact to the group
    this.groupContacts.push(selectedContact);
  }

  // Check if a contact is invalid for the group
  isInvalidContact(newContact: Contact): boolean {
    if (!newContact || this.contact.id === newContact.id) {
      return true;
    }

    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  // Handle removing an item from the group
  onRemoveItem(index: number, event: MouseEvent) {
    event.preventDefault();

    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }

    // Remove the item from the group contacts array
    this.groupContacts.splice(index, 1);
  }
}
