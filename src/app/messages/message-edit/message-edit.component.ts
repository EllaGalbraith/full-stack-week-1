import { Component, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core';

import { Message } from '../message.model';

@Component({
  selector: 'app-message-edit',
  standalone: false,
  
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('msgText') msgText: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();
  currentSender: string = 'Ella';

  onSendMessage() {
    const msgSubject = this.subject.nativeElement.value;
    const msgText = this.msgText.nativeElement.value;
    const newMessage = new Message(1, msgSubject, msgText, this.currentSender, 'assets/images/ella.jpg', 'null');
    this.addMessageEvent.emit(newMessage);
    console.log('Message sent!: ' + msgSubject + ' - ' + msgText);
    console.log(newMessage);
    console.log(this.msgText)
    console.log(this.subject.nativeElement.value)

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
