import { Component } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddPartiePrenanteComponent } from '../add-partie-prenante/add-partie-prenante.component';
  import { EditPartiePrenanteComponent } from '../edit-partie-prenante/edit-partie-prenante.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  @Component({
    selector: 'app-list-partie-prenante',
    standalone: true, // Composant autonome
    imports: [AddPartiePrenanteComponent,EditPartiePrenanteComponent], // Dépendances importées
    templateUrl: './list-partie-prenante.component.html',
    styleUrls: ['./list-partie-prenante.component.css']
  })
  export class ListPartiePrenanteComponent {
    loading_get_partie_prenante = false
    les_partie_prenantes: any[] = []
    selected_partie_prenante: any = undefined
    partie_prenante_to_edit: any = undefined
    loading_delete_partie_prenante = false
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      this.get_partie_prenante()
    }
    get_partie_prenante() {
      this.loading_get_partie_prenante = true;
      this.api.taf_post("partie_prenante/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_partie_prenantes = reponse.data
          console.log("Opération effectuée avec succés sur la table partie_prenante. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table partie_prenante a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_partie_prenante = false;
      }, (error: any) => {
        this.loading_get_partie_prenante = false;
      })
    }
  
    voir_plus(one_partie_prenante: any) {
      this.selected_partie_prenante = one_partie_prenante
    }
    on_click_edit(one_partie_prenante: any) {
      this.partie_prenante_to_edit = one_partie_prenante
    }
    on_close_modal_edit(){
      this.partie_prenante_to_edit=undefined
    }
    delete_partie_prenante (partie_prenante : any){
      this.loading_delete_partie_prenante = true;
      this.api.taf_post("partie_prenante/delete", partie_prenante,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table partie_prenante . Réponse = ",reponse)
          this.get_partie_prenante()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table partie_prenante  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_partie_prenante = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_partie_prenante = false;
      })
    }
    openModal_add_partie_prenante() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddPartiePrenanteComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_partie_prenante()
        } else {

        }
      })
    }
    openModal_edit_partie_prenante(one_partie_prenante: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditPartiePrenanteComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.partie_prenante_to_edit = one_partie_prenante;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_partie_prenante()
        } else {

        }
      })
    }
  }