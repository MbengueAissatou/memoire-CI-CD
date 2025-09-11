import { Component } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddCelluleComponent } from '../add-cellule/add-cellule.component';
import { EditCelluleComponent } from '../edit-cellule/edit-cellule.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { SearchServiceService } from 'src/app/service/searchService/search-service.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-list-cellule',
  standalone: true, // Composant autonome
  imports: [AddCelluleComponent, EditCelluleComponent, NgIf, NgClass, CommonModule, FormsModule], // Dépendances importées
  templateUrl: './list-cellule.component.html',
  styleUrls: ['./list-cellule.component.css']
})
export class ListCelluleComponent {
  loading_get_cellule = false
  les_cellules: any[] = []
  selected_cellule: any = undefined
  cellule_to_edit: any = undefined
  loading_delete_cellule = false
  list: any[] = []

  filter: any = {
    text: ""
  }
  constructor(public api: ApiService, private modalService: NgbModal, public searchService: SearchServiceService, public activeModal: NgbActiveModal) {
    // Initialisation du service de recherche
    // this.searchService.data = this.les_cellules; // Mettre à jour les données de recherche
    // this.searchService.filter_change();

  }
  ngOnInit(): void {
    this.get_cellule()
  }
  get_cellule() {
    this.loading_get_cellule = true;
    this.api.taf_post("cellule/get", {}, (reponse: any) => {
      if (reponse.status) {
        this.les_cellules = reponse.data
        this.list = this.les_cellules;
        console.log("la liste:", this.list);
        this.filter_change()
        // this.searchService.data = this.les_cellules; // Mettre à jour les données de recherche
        // this.searchService.filter_change();
        console.log("Opération effectuée avec succés sur la table cellule. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table cellule a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_cellule = false;
    }, (error: any) => {
      this.loading_get_cellule = false;
    })
  }

  voir_plus(one_cellule: any) {
    this.selected_cellule = one_cellule
  }
  on_click_edit(one_cellule: any) {
    this.cellule_to_edit = one_cellule
  }
  on_close_modal_edit() {
    this.cellule_to_edit = undefined
  }
  delete_cellule(cellule: any) {
    this.loading_delete_cellule = true;
    this.api.taf_post("cellule/delete", cellule, (reponse: any) => {
      //when success
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table cellule . Réponse = ", reponse)
        this.get_cellule()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table cellule  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_cellule = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_cellule = false;
      })
  }
  openModal_add_cellule() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(AddCelluleComponent, { ...options, backdrop: 'static' })
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_cellule()
      } else {

      }
    })
  }
  openModal_edit_cellule(one_cellule: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditCelluleComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.cellule_to_edit = one_cellule;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_cellule()
      } else {

      }
    })
  }
  filter_change() {
    console.log("filter= ", this.filter)
    this.list = this.les_cellules.filter((one: any) => {
      let text = this.filter.text.trim() === "" ||
        JSON.stringify(one).toLowerCase().replace(/\s/g, "").includes(this.filter.text.toLowerCase().replace(/\s/g, ""));

      return text
    })
  }
}
