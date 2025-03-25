import { OnInit, Injectable, EventEmitter } from "@angular/core";
import { of, Observable, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';


// import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import { Document } from "./document.model";
// import mongoose from "mongoose";
// import { Document } from "../../../server/models/document";

@Injectable({
    providedIn: 'root'
  })
  export class DocumentService implements OnInit {
    private baseUrl = 'https://full-stack-development-d06db-default-rtdb.firebaseio.com/';
    documentListChangedEvent = new Subject<Document[]>();
    documentSelectedEvent = new EventEmitter<Document>();
    private documents: Document[] = []; // Initialize with an empty array
    private maxDocumentId: number;

    // private DocumentModel = mongoose.model('Document');
  
    constructor(private http: HttpClient) {
      this.maxDocumentId = this.getMaxId(); // This method assumes the array isn't empty
    }
  
    ngOnInit() {}

    private sortAndSend() {
      this.documents.sort((a, b) => {
        const titleA = a.name || ''; // Default to an empty string if title is missing
        const titleB = b.name || ''; // Default to an empty string if title is missing
        return titleA.localeCompare(titleB);
      });
      this.documentListChangedEvent.next(this.documents.slice());
    }
    
  
    getDocuments(): Observable<Document[]> {
      return this.http.get<Document[]>('http://localhost:3000/documents').pipe(
        map((documents: Document[] | null) => {
          this.documents = documents ? documents : []; // Ensure the array is not null/undefined
          this.maxDocumentId = this.getMaxId();
    
          // Ensure all documents have a 'title' field or default to an empty string
          this.documents.forEach(doc => {
            if (!doc.name) {
              doc.name = ''; // Default to empty string if 'title' is missing
            }
          });
    
          // Sort documents by title
          this.sortAndSend();
    
          return this.documents;
        }),
        catchError((error) => {
          console.error('Error fetching documents:', error);
          return of([]); // Return an empty array in case of error
        })
      );
    }
    

    storeDocuments() {
        let documents = JSON.stringify(this.documents);
        let headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json');
        this.http.put(this.baseUrl + 'documents.json', documents, {headers: headers})
          .subscribe(() => {
            this.documentListChangedEvent.next(this.documents.slice());
          });
      }
      
  
    getDocument(id: string) {
      for (let document of this.documents) {
        if (document.id === id) {
          return document;
        }
      }
      return null;
    }
  
    getMaxId(): number {
      let maxId = 0;
      for (let document of this.documents) {
        const currentId = +document.id;  // Ensure id is treated as a number
        if (currentId > maxId) {
          maxId = currentId;  // Get the highest ID
        }
      }
      return maxId;
    }
    
    addDocument(document: Document) {
      if (!document || !document.name) {  // Ensure 'title' is defined before proceeding
        return;
      }
    
      // Get the next ID by adding 1 to the highest current ID
      const newId = this.getMaxId() + 1;
    
      document.id = newId.toString();  // Set the document's id to the next available id
    
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
      this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents', document, { headers })
        .subscribe(
          (responseData) => {
            // Check if the new document has the correct id returned by the server
            this.documents.push(responseData.document);  // Push the new document to the list
            this.sortAndSend();  // Optionally, re-sort the list of documents if needed
          },
          (error) => {
            console.error('Error adding document:', error);
          }
        );
    }   
    
  
    updateDocument(originalDocument: Document, newDocument: Document) {
      if (!originalDocument || !newDocument) {
        return;
      }
  
      const pos = this.documents.findIndex(d => d.id === originalDocument.id);
  
      if (pos < 0) {
        return;
      }
  
      // set the id of the new Document to the id of the old Document
      newDocument.id = originalDocument.id;
      // newDocument._id = originalDocument._id;
  
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
      // update database
      this.http.put('http://localhost:3000/documents/' + originalDocument.id,
        newDocument, { headers: headers })
        .subscribe(
          (response: Response) => {
            this.documents[pos] = newDocument;
            this.sortAndSend();
          }
        );
    }
  
    deleteDocument(document: Document) {

      if (!document) {
        return;
      }
  
      const pos = this.documents.findIndex(d => d.id === document.id);
  
      if (pos < 0) {
        return;
      }
  
      // delete from database
      this.http.delete('http://localhost:3000/documents/' + document.id)
        .subscribe(
          (response: Response) => {
            this.documents.splice(pos, 1);
            this.sortAndSend();
          }
        );
    }
  }