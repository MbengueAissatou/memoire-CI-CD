import { Component } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddStatutFactureComponent } from '../add-statut-facture/add-statut-facture.component';
  import { EditStatutFactureComponent } from '../edit-statut-facture/edit-statut-facture.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  @Component({
    selector: 'app-list-statut-facture',
    standalone: true, // Composant autonome
    imports: [AddStatutFactureComponent,EditStatutFactureComponent], // Dépendances importées
    templateUrl: './list-statut-facture.component.html',
    styleUrls: ['./list-statut-facture.component.css']
  })
  export class ListStatutFactureComponent {
    loading_get_statut_facture = false
    les_statut_factures: any[] = []
    selected_statut_facture: any = undefined
    statut_facture_to_edit: any = undefined
    loading_delete_statut_facture = false
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      this.get_statut_facture()
    }
    get_statut_facture() {
      this.loading_get_statut_facture = true;
      this.api.taf_post("statut_facture/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_statut_factures = reponse.data
          console.log("Opération effectuée avec succés sur la table statut_facture. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table statut_facture a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_statut_facture = false;
      }, (error: any) => {
        this.loading_get_statut_facture = false;
      })
    }
  
    voir_plus(one_statut_facture: any) {
      this.selected_statut_facture = one_statut_facture
    }
    on_click_edit(one_statut_facture: any) {
      this.statut_facture_to_edit = one_statut_facture
    }
    on_close_modal_edit(){
      this.statut_facture_to_edit=undefined
    }
    delete_statut_facture (statut_facture : any){
      this.loading_delete_statut_facture = true;
      this.api.taf_post("statut_facture/delete", statut_facture,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table statut_facture . Réponse = ",reponse)
          this.get_statut_facture()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table statut_facture  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_statut_facture = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_statut_facture = false;
      })
    }
    openModal_add_statut_facture() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddStatutFactureComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_statut_facture()
        } else {

        }
      })
    }
    openModal_edit_statut_facture(one_statut_facture: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditStatutFactureComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.statut_facture_to_edit = one_statut_facture;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_statut_facture()
        } else {

        }
      })
    }
  }