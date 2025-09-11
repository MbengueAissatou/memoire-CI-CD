import { Component } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddPartenaireProjetComponent } from '../add-partenaire-projet/add-partenaire-projet.component';
  import { EditPartenaireProjetComponent } from '../edit-partenaire-projet/edit-partenaire-projet.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  @Component({
    selector: 'app-list-partenaire-projet',
    standalone: true, // Composant autonome
    imports: [AddPartenaireProjetComponent,EditPartenaireProjetComponent], // Dépendances importées
    templateUrl: './list-partenaire-projet.component.html',
    styleUrls: ['./list-partenaire-projet.component.css']
  })
  export class ListPartenaireProjetComponent {
    loading_get_partenaire_projet = false
    les_partenaire_projets: any[] = []
    selected_partenaire_projet: any = undefined
    partenaire_projet_to_edit: any = undefined
    loading_delete_partenaire_projet = false
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      this.get_partenaire_projet()
    }
    get_partenaire_projet() {
      this.loading_get_partenaire_projet = true;
      this.api.taf_post("partenaire_projet/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_partenaire_projets = reponse.data
          console.log("Opération effectuée avec succés sur la table partenaire_projet. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table partenaire_projet a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_partenaire_projet = false;
      }, (error: any) => {
        this.loading_get_partenaire_projet = false;
      })
    }
  
    voir_plus(one_partenaire_projet: any) {
      this.selected_partenaire_projet = one_partenaire_projet
    }
    on_click_edit(one_partenaire_projet: any) {
      this.partenaire_projet_to_edit = one_partenaire_projet
    }
    on_close_modal_edit(){
      this.partenaire_projet_to_edit=undefined
    }
    delete_partenaire_projet (partenaire_projet : any){
      this.loading_delete_partenaire_projet = true;
      this.api.taf_post("partenaire_projet/delete", partenaire_projet,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table partenaire_projet . Réponse = ",reponse)
          this.get_partenaire_projet()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table partenaire_projet  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_partenaire_projet = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_partenaire_projet = false;
      })
    }
    openModal_add_partenaire_projet() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddPartenaireProjetComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_partenaire_projet()
        } else {

        }
      })
    }
    openModal_edit_partenaire_projet(one_partenaire_projet: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditPartenaireProjetComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.partenaire_projet_to_edit = one_partenaire_projet;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_partenaire_projet()
        } else {

        }
      })
    }
  }