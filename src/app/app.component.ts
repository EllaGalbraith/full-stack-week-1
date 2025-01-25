import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedFeature = 'documents';

  switchView(selectedFeature: string) {
    this.selectedFeature = selectedFeature;
    console.log('switched')
    console.log(this.selectedFeature);
  }

}
