import { Component } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddEtatProjetComponent } from '../add-etat-projet/add-etat-projet.component';
  import { EditEtatProjetComponent } from '../edit-etat-projet/edit-etat-projet.component';
  import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
  @Component({
    selector: 'app-list-etat-projet',
    standalone: true, // Composant autonome
    imports: [AddEtatProjetComponent,EditEtatProjetComponent], // Dépendances importées
    templateUrl: './list-etat-projet.component.html',
    styleUrls: ['./list-etat-projet.component.css']
  })
  export class ListEtatProjetComponent {
    loading_get_etat_projet = false
    les_etat_projets: any[] = []
    selected_etat_projet: any = undefined
    etat_projet_to_edit: any = undefined
    loading_delete_etat_projet = false
    constructor(public api: ApiService,private modalService: NgbModal,public activeModal: NgbActiveModal) {
  
    }
    ngOnInit(): void {
      this.get_etat_projet()
    }
    get_etat_projet() {
      this.loading_get_etat_projet = true;
      this.api.taf_post("etat_projet/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_etat_projets = reponse.data
          console.log("Opération effectuée avec succés sur la table etat_projet. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table etat_projet a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_etat_projet = false;
      }, (error: any) => {
        this.loading_get_etat_projet = false;
      })
    }
  
    voir_plus(one_etat_projet: any) {
      this.selected_etat_projet = one_etat_projet
    }
    on_click_edit(one_etat_projet: any) {
      this.etat_projet_to_edit = one_etat_projet
    }
    on_close_modal_edit(){
      this.etat_projet_to_edit=undefined
    }
    delete_etat_projet (etat_projet : any){
      this.loading_delete_etat_projet = true;
      this.api.taf_post("etat_projet/delete", etat_projet,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table etat_projet . Réponse = ",reponse)
          this.get_etat_projet()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table etat_projet  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_etat_projet = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_etat_projet = false;
      })
    }
    openModal_add_etat_projet() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddEtatProjetComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_etat_projet()
        } else {

        }
      })
    }
    openModal_edit_etat_projet(one_etat_projet: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditEtatProjetComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.etat_projet_to_edit = one_etat_projet;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_etat_projet()
        } else {

        }
      })
    }
  }