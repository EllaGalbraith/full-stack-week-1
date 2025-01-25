import { Component, Input } from '@angular/core';

import { Contact } from '../contact.model';

@Component({
  selector: 'app-contact-details',
  standalone: false,
  
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.css'
})
export class ContactDetailsComponent {
  @Input() contact: Contact;
  // detail: Contact = new Contact(1, "R. Kent Jackson", "jacksonk@byui.edu", "208-496-3771",  "/images/jacksonk.jpg", null);
  

}
