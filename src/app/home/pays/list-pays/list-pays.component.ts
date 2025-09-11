import { Component } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddPaysComponent } from '../add-pays/add-pays.component';
import { EditPaysComponent } from '../edit-pays/edit-pays.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
import { SearchServiceService } from 'src/app/service/searchService/search-service.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-list-pays',
  standalone: true, // Composant autonome
  imports: [AddPaysComponent, EditPaysComponent, NgIf, FormsModule], // Dépendances importées
  templateUrl: './list-pays.component.html',
  styleUrls: ['./list-pays.component.css']
})
export class ListPaysComponent {
  loading_get_pays = false
  les_payss: any[] = []
  selected_pays: any = undefined
  pays_to_edit: any = undefined
  loading_delete_pays = false
  list: any[] = []

  filter: any = {
    text: ""
  }
  constructor(public api: ApiService, private modalService: NgbModal, public searchService: SearchServiceService, public activeModal: NgbActiveModal) {
    //
  }
  ngOnInit(): void {
    this.get_pays()
  }
  get_pays() {
    this.loading_get_pays = true;
    this.api.taf_post("pays/get", {}, (reponse: any) => {
      if (reponse.status) {
        this.les_payss = reponse.data
        // this.list = reponse.data
        // this.searchService.data = this.les_payss; // Mettre à jour les données de recherche
        // this.searchService.filter_change();
        console.log("Opération effectuée avec succés sur la table pays. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table pays a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_pays = false;
    }, (error: any) => {
      this.loading_get_pays = false;
    })
  }

  voir_plus(one_pays: any) {
    this.selected_pays = one_pays
  }
  on_click_edit(one_pays: any) {
    this.pays_to_edit = one_pays
  }
  on_close_modal_edit() {
    this.pays_to_edit = undefined
  }
  delete_pays(pays: any) {
    this.loading_delete_pays = true;
    this.api.taf_post("pays/delete", pays, (reponse: any) => {
      //when success
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table pays . Réponse = ", reponse)
        this.get_pays()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table pays  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_pays = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_pays = false;
      })
  }
  openModal_add_pays() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(AddPaysComponent, { ...options, backdrop: 'static' })
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_pays()
      } else {

      }
    })
  }
  openModal_edit_pays(one_pays: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditPaysComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.pays_to_edit = one_pays;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_pays()
      } else {

      }
    })
  }

  filter_change() {
    console.log("filter= ", this.filter)
    this.list = this.les_payss.filter((one: any) => {
      let text = this.filter.text.trim() === "" ||
        JSON.stringify(one).toLowerCase().replace(/\s/g, "").includes(this.filter.text.toLowerCase().replace(/\s/g, ""));

      return text
    })
  }
}


