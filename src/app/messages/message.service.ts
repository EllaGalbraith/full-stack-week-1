import { OnInit, Injectable, EventEmitter } from "@angular/core";
import { of, Observable, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { Message } from "./message.model";

@Injectable({
    providedIn: 'root'
  })
  export class MessageService implements OnInit {
    private baseUrl = 'http://localhost:3000/messages';  // Update URL for messages
    messageListChangedEvent = new Subject<Message[]>();
    messageSelectedEvent = new EventEmitter<Message>();
    private messages: Message[] = []; // Initialize with an empty array
    private maxMessageId: number;
  
    constructor(private http: HttpClient) { }
  
    ngOnInit(): void {
      // Subscribe to the observable returned by getMessages
      this.getMessages().subscribe(
        (messages: Message[]) => {
          this.messages = messages;
        }
      );
      
      // Listen for changes to the message list
      this.messageListChangedEvent.subscribe(
        (messages: Message[]) => {
          this.messages = messages;
        }
      );
    }
  
    private sortAndSend() {
      this.messages.sort((a, b) => a.subject.localeCompare(b.subject));  // Sorting by subject of the message
      this.messageListChangedEvent.next(this.messages.slice());
    }
  
    getMessages(): Observable<Message[]> {
      return this.http.get<Message[]>(this.baseUrl).pipe(
        map((messages: Message[] | null) => {
          this.messages = messages ? messages : []; // Ensure array is not null/undefined
          this.maxMessageId = this.getMaxId();
  
          // Sort messages by subject
          this.messages.sort((a, b) => a.subject.localeCompare(b.subject));
  
          // Emit event to notify components
          this.messageListChangedEvent.next(this.messages.slice());
  
          return this.messages; // Ensure method returns the messages array
        }),
        catchError((error) => {
          console.error('Error fetching messages:', error);
          return of([]); // Return an empty array in case of error
        })
      );
    }
  
    storeMessages() {
      let messages = JSON.stringify(this.messages);
      let headers = new HttpHeaders();
      headers.set('Content-Type', 'application/json');
      this.http.put(this.baseUrl + '.json', messages, { headers: headers })
        .subscribe(() => {
          this.messageListChangedEvent.next(this.messages.slice());
        });
    }
  
    getMessage(id: string) {
      for (let message of this.messages) {
        if (message.id === id) {
          return message;
        }
      }
      return null;
    }
  
    getMaxId(): number {
      let maxId = 0;
      for (let message of this.messages) {
        const currentId = +message.id;
        if (currentId > maxId) {
          maxId = currentId;
        }
      }
      return maxId;
    }
  
    addMessage(message: Message) {
        if (!message) {
          return;
        }
      
        // Ensure the ID is assigned correctly
        const newId = (this.maxMessageId + 1).toString();
        message.id = newId;
      
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
      
        // Add to the database
        this.http.post<{ message: string, messageData: Message }>(this.baseUrl,
          message,
          { headers: headers })
          .subscribe(
            (responseData) => {
              this.messages.push(responseData.messageData);
              this.sortAndSend();
            },
            (error) => {
              console.error('Error adding message:', error);
            }
          );
      }
      
      
  
    updateMessage(originalMessage: Message, newMessage: Message) {
      if (!originalMessage || !newMessage) {
        return;
      }
  
      const pos = this.messages.findIndex(m => m.id === originalMessage.id);
  
      if (pos < 0) {
        return;
      }
  
      // set the id of the new Message to the id of the old Message
      newMessage.id = originalMessage.id;
  
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
      // update database
      this.http.put(this.baseUrl + '/' + originalMessage.id,
        newMessage, { headers: headers })
        .subscribe(
          (response: Response) => {
            this.messages[pos] = newMessage;
            this.sortAndSend();
          }
        );
    }
  
    deleteMessage(message: Message) {
      if (!message) {
        return;
      }
  
      const pos = this.messages.findIndex(m => m.id === message.id);
  
      if (pos < 0) {
        return;
      }
  
      // delete from database
      this.http.delete(this.baseUrl + '/' + message.id)
        .subscribe(
          (response: Response) => {
            this.messages.splice(pos, 1);
            this.sortAndSend();
          }
        );
    }
  }
  