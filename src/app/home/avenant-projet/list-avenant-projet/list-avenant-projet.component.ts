import { Component } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddAvenantProjetComponent } from '../add-avenant-projet/add-avenant-projet.component';
  import { EditAvenantProjetComponent } from '../edit-avenant-projet/edit-avenant-projet.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchServiceService } from 'src/app/service/searchService/search-service.service';
  @Component({
    selector: 'app-list-avenant-projet',
    standalone: true, // Composant autonome
    imports: [AddAvenantProjetComponent,EditAvenantProjetComponent], // Dépendances importées
    templateUrl: './list-avenant-projet.component.html',
    styleUrls: ['./list-avenant-projet.component.css']
  })
  export class ListAvenantProjetComponent {
    loading_get_avenant_projet = false
    les_avenant_projets: any[] = []
    selected_avenant_projet: any = undefined
    avenant_projet_to_edit: any = undefined
    loading_delete_avenant_projet = false
    constructor(public api: ApiService,private modalService: NgbModal, public searchService: SearchServiceService) {

    }
    ngOnInit(): void {
      this.get_avenant_projet()
    }
    get_avenant_projet() {
      this.loading_get_avenant_projet = true;
      this.api.taf_post("avenant_projet/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_avenant_projets = reponse.data
           this.searchService.data = this.les_avenant_projets; // Mettre à jour les données de recherche
          this.searchService.filter_change();
          console.log("Opération effectuée avec succés sur la table avenant_projet. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table avenant_projet a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_avenant_projet = false;
      }, (error: any) => {
        this.loading_get_avenant_projet = false;
      })
    }

    voir_plus(one_avenant_projet: any) {
      this.selected_avenant_projet = one_avenant_projet
    }
    on_click_edit(one_avenant_projet: any) {
      this.avenant_projet_to_edit = one_avenant_projet
    }
    on_close_modal_edit(){
      this.avenant_projet_to_edit=undefined
    }
    delete_avenant_projet (avenant_projet : any){
      this.loading_delete_avenant_projet = true;
      this.api.taf_post("avenant_projet/delete", avenant_projet,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table avenant_projet . Réponse = ",reponse)
          this.get_avenant_projet()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table avenant_projet  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_avenant_projet = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_avenant_projet = false;
      })
    }
    openModal_add_avenant_projet() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddAvenantProjetComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_avenant_projet()
        } else {

        }
      })
    }
    openModal_edit_avenant_projet(one_avenant_projet: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "xl"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditAvenantProjetComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.avenant_projet_to_edit = one_avenant_projet;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_avenant_projet()
        } else {

        }
      })
    }
  }
