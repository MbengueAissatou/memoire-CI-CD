import { Component } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddPartenaireComponent } from '../add-partenaire/add-partenaire.component';
  import { EditPartenaireComponent } from '../edit-partenaire/edit-partenaire.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgClass, NgIf } from '@angular/common';
import { SearchServiceService } from 'src/app/service/searchService/search-service.service';
  @Component({
    selector: 'app-list-partenaire',
    standalone: true, // Composant autonome
    imports: [AddPartenaireComponent,EditPartenaireComponent,NgIf,NgClass], // Dépendances importées
    templateUrl: './list-partenaire.component.html',
    styleUrls: ['./list-partenaire.component.css']
  })
  export class ListPartenaireComponent {
    loading_get_partenaire = false
    les_partenaires: any[] = []
    selected_partenaire: any = undefined
    partenaire_to_edit: any = undefined
    loading_delete_partenaire = false
    constructor(public api: ApiService,private modalService: NgbModal,public searchService: SearchServiceService) {
      // Initialisation du service de recherche
      this.searchService.data = this.les_partenaires; // Mettre à jour les données de recherche
      this.searchService.filter_change();

    }
    ngOnInit(): void {
      this.get_partenaire()
    }
    get_partenaire() {
      this.loading_get_partenaire = true;
      this.api.taf_post("partenaire/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_partenaires = reponse.data
          this.searchService.data = this.les_partenaires; // Mettre à jour les données de recherche
          this.searchService.filter_change();
          console.log("Opération effectuée avec succés sur la table partenaire. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table partenaire a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_partenaire = false;
      }, (error: any) => {
        this.loading_get_partenaire = false;
      })
    }

    voir_plus(one_partenaire: any) {
      this.selected_partenaire = one_partenaire
    }
    on_click_edit(one_partenaire: any) {
      this.partenaire_to_edit = one_partenaire
    }
    on_close_modal_edit(){
      this.partenaire_to_edit=undefined
    }
    delete_partenaire (partenaire : any){
      this.loading_delete_partenaire = true;
      this.api.taf_post("partenaire/delete", partenaire,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table partenaire . Réponse = ",reponse)
          this.get_partenaire()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table partenaire  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_partenaire = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_partenaire = false;
      })
    }
    openModal_add_partenaire() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddPartenaireComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_partenaire()
        } else {

        }
      })
    }
    openModal_edit_partenaire(one_partenaire: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditPartenaireComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.partenaire_to_edit = one_partenaire;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_partenaire()
        } else {

        }
      })
    }
  }
