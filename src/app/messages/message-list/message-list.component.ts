import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  standalone: false,
  
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message(
      1,
      "Meeting Reminder",
      "Don't forget about the team meeting tomorrow at 10 AM.",
      "Alex Johnson",
      "https://via.placeholder.com/150",
      "Work"
    ),
    new Message(
      2,
      "Weekend Plans",
      "Are we still on for the beach trip this Saturday?",
      "Ella Galbraith",
      "https://via.placeholder.com/150",
      "Friends"
    ),
    new Message(
      3,
      "Sale Alert!",
      "Flash sale on your favorite items! Check it out now!",
      "ShopEZ",
      "https://via.placeholder.com/150",
      "Promotions"
    )
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
    console.log('Message added!');
  }

}
