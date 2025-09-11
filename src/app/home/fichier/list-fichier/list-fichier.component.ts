import { Component } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddFichierComponent } from '../add-fichier/add-fichier.component';
  import { EditFichierComponent } from '../edit-fichier/edit-fichier.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  @Component({
    selector: 'app-list-fichier',
    standalone: true, // Composant autonome
    imports: [AddFichierComponent,EditFichierComponent], // Dépendances importées
    templateUrl: './list-fichier.component.html',
    styleUrls: ['./list-fichier.component.css']
  })
  export class ListFichierComponent {
    loading_get_fichier = false
    les_fichiers: any[] = []
    selected_fichier: any = undefined
    fichier_to_edit: any = undefined
    loading_delete_fichier = false
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      this.get_fichier()
    }
    get_fichier() {
      this.loading_get_fichier = true;
      this.api.taf_post("fichier/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_fichiers = reponse.data
          console.log("Opération effectuée avec succés sur la table fichier. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table fichier a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_fichier = false;
      }, (error: any) => {
        this.loading_get_fichier = false;
      })
    }
  
    voir_plus(one_fichier: any) {
      this.selected_fichier = one_fichier
    }
    on_click_edit(one_fichier: any) {
      this.fichier_to_edit = one_fichier
    }
    on_close_modal_edit(){
      this.fichier_to_edit=undefined
    }
    delete_fichier (fichier : any){
      this.loading_delete_fichier = true;
      this.api.taf_post("fichier/delete", fichier,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table fichier . Réponse = ",reponse)
          this.get_fichier()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table fichier  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_fichier = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_fichier = false;
      })
    }
    openModal_add_fichier() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddFichierComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_fichier()
        } else {

        }
      })
    }
    openModal_edit_fichier(one_fichier: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditFichierComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.fichier_to_edit = one_fichier;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_fichier()
        } else {

        }
      })
    }
  }