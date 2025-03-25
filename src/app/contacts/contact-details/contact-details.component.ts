import { Component, Input, OnInit } from '@angular/core';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contact-details',
  standalone: false,
  
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.css'
})
export class ContactDetailsComponent implements OnInit {
  @Input() contact: Contact;
  // detail: Contact = new Contact(1, "R. Kent Jackson", "jacksonk@byui.edu", "208-496-3771",  "/images/jacksonk.jpg", null);

  constructor(private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (!id) {
        return;
      }
      
      this.contactService.getContact(id).subscribe(contact => {
        if (!contact) {
          console.error(`Contact with ID ${id} not found.`);
          this.router.navigate(['/contacts']); // Redirect if not found
          return;
        }
        this.contact = contact;
      });
    });
  }
  

  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigate(['/contacts']);
  }
  

}
