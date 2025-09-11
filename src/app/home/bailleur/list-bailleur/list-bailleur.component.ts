import { Component } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddBailleurComponent } from '../add-bailleur/add-bailleur.component';
import { EditBailleurComponent } from '../edit-bailleur/edit-bailleur.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { SearchServiceService } from 'src/app/service/searchService/search-service.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-list-bailleur',
  standalone: true, // Composant autonome
  imports: [AddBailleurComponent, EditBailleurComponent, NgIf, NgClass, CommonModule, FormsModule], // Dépendances importées
  templateUrl: './list-bailleur.component.html',
  styleUrls: ['./list-bailleur.component.css']
})
export class ListBailleurComponent {
  loading_get_bailleur = false
  les_bailleurs: any[] = []
  selected_bailleur: any = undefined
  bailleur_to_edit: any = undefined
  loading_delete_bailleur = false
  list: any[] = []

  filter: any = {
    text: ""
  }
  constructor(public api: ApiService, private modalService: NgbModal, public searchService: SearchServiceService, public activeModal: NgbActiveModal) {
    // Initialisation du service de recherche
    this.searchService.data = this.les_bailleurs; // Mettre à jour les données de recherche
    this.searchService.filter_change();

  }
  ngOnInit(): void {
    this.get_bailleur()
  }
  get_bailleur() {
    this.loading_get_bailleur = true;
    this.api.taf_post("bailleur/get", {}, (reponse: any) => {
      if (reponse.status) {
        this.les_bailleurs = reponse.data
        // this.searchService.data = this.les_bailleurs; // Mettre à jour les données de recherche
        // this.searchService.filter_change();
        this.list = this.les_bailleurs;
        console.log("la liste:", this.list);
        this.filter_change()

        console.log("Opération effectuée avec succés sur la table bailleur. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table bailleur a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_bailleur = false;
    }, (error: any) => {
      this.loading_get_bailleur = false;
    })
  }

  voir_plus(one_bailleur: any) {
    this.selected_bailleur = one_bailleur
  }
  on_click_edit(one_bailleur: any) {
    this.bailleur_to_edit = one_bailleur
  }
  on_close_modal_edit() {
    this.bailleur_to_edit = undefined
  }
  delete_bailleur(bailleur: any) {
    this.loading_delete_bailleur = true;
    this.api.taf_post("bailleur/delete", bailleur, (reponse: any) => {
      //when success
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table bailleur . Réponse = ", reponse)
        this.get_bailleur()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table bailleur  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_bailleur = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_bailleur = false;
      })
  }
  openModal_add_bailleur() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(AddBailleurComponent, { ...options, backdrop: 'static' })
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_bailleur()
      } else {

      }
    })
  }
  openModal_edit_bailleur(one_bailleur: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditBailleurComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.bailleur_to_edit = one_bailleur;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_bailleur()
      } else {

      }
    })
  }
  filter_change() {
    console.log("filter= ", this.filter)
    this.list = this.les_bailleurs.filter((one: any) => {
      let text = this.filter.text.trim() === "" ||
        JSON.stringify(one).toLowerCase().replace(/\s/g, "").includes(this.filter.text.toLowerCase().replace(/\s/g, ""));

      return text
    })
  }
}
