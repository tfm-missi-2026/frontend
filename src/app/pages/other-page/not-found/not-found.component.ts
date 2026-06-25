import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonGridShapeComponent } from '../../../shared/common/grid-shape';

@Component({
  selector: 'app-not-found',
  imports: [
    RouterModule,
    CommonGridShapeComponent,
  ],
  templateUrl: './not-found.component.html',
  styles: ``
})
export class NotFoundComponent {

  currentYear: number = new Date().getFullYear();
}
