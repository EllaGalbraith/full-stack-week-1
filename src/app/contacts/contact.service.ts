import {EventEmitter, Injectable} from '@angular/core';
import {Contact} from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
    contactSelectedEvent = new EventEmitter<Contact>();

    // contactChangedEvent = new EventEmitter<Contact[]>();

    contactListChangedEvent = new Subject<Contact[]>();
    maxContactId: number;

   private contacts: Contact [] =[];

   constructor() {
      this.contacts = MOCKCONTACTS;
   }

    getContacts(): Contact[] {
        return this.contacts.slice();
    }

    getContact(id: string): Contact {
        for (let contact of this.contacts) {
            if (contact.id === id) {
                return contact;
            }
        }
        return null;
    }

    getMaxId(): number {
        let maxId = 0;
        for (let contact of this.contacts) {
            const currentId = +contact.id;
            if (currentId > maxId) {
                maxId = currentId;
            }
        }
        return maxId;
    }

    addContact(contact: Contact) {
        if (!contact) {
            return;
        }
        this.maxContactId++;
        contact.id = this.maxContactId.toString();
        this.contacts.push(contact);
        const contactsListClone = this.contacts.slice();
        this.contactListChangedEvent.next(contactsListClone);
        // this.contactChangedEvent.emit(contactsListClone);
    }

    updateContact(originalContact: Contact, newContact: Contact) {
        if (!originalContact || !newContact) {
            return;
        }
        const pos = this.contacts.indexOf(originalContact);
        if (pos < 0) {
            return;
        }
        newContact.id = originalContact.id;
        this.contacts[pos] = newContact;
        const contactsListClone = this.contacts.slice();
        this.contactListChangedEvent.next(contactsListClone);
        // this.contactChangedEvent.emit(contactsListClone);
    }

    deleteContact(contact: Contact) {
        if (!contact) {
            return;
        }
        const pos = this.contacts.indexOf(contact);
        if (pos < 0) {
            return;
        }
        this.contacts.splice(pos, 1);
        const contactsListClone = this.contacts.slice();
        this.contactListChangedEvent.next(contactsListClone);
        // this.contactChangedEvent.emit(this.contacts.slice());
    }
}