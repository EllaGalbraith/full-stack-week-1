import { OnInit, Injectable, EventEmitter } from "@angular/core";

import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import { Document } from "./document.model";

@Injectable({
    providedIn: 'root'
  })
export class DocumentService implements OnInit {
    documentSelectedEvent = new EventEmitter<Document>();
    private documents: Document[] = [];

    constructor() {
        this.documents = MOCKDOCUMENTS;
    }

    ngOnInit() {
    }

    getDocuments() {
        return this.documents.slice();
    }

    getDocument(id: string) {
        for (let document of this.documents) {
            if (document.id === id) {
                return document;
            }
        }
        return null;
    }
}