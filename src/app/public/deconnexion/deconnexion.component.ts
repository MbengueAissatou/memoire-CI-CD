import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api/api.service';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-deconnexion',
  templateUrl: './deconnexion.component.html',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  styleUrls: ['./deconnexion.component.css']
})
export class DeconnexionComponent {
  constructor(public api: ApiService, private route: Router , public _location : Location) {

  }
  async deconnexion() {
    this.api.network = {
      token: undefined,
      status: true,
      message: "Aucun probléme détecté",
    }
    await this.api.delete_from_local_storage('token')
    this.route.navigateByUrl('/public/login')
  }
  retour(){
    this._location.back()
  }
}
