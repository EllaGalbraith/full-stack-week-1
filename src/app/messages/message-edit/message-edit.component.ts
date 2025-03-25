import { Component, ViewChild, ElementRef } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-edit',
  standalone: false,
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('msgText') msgText: ElementRef;
  currentSender: string = '660e5f5a5c3b2a6d4f1e9b8c';  // You can dynamically set this based on user authentication

  constructor(private messageService: MessageService) {}

  onSendMessage() {
    const subjectValue = this.subject.nativeElement.value;
    const msgTextValue = this.msgText.nativeElement.value;
    
    // Ensure the id is a string and not a Promise
    const newMessage = new Message('1', subjectValue, msgTextValue, this.currentSender);  // '1' should be a string
    
    this.messageService.addMessage(newMessage);
  }
  

  onClear() {
    if (this.subject && this.subject.nativeElement) {
      this.subject.nativeElement.value = '';
    }
    if (this.msgText && this.msgText.nativeElement) {
      this.msgText.nativeElement.value = '';
    }
  }
}
