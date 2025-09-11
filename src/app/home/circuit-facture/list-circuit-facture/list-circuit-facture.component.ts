import { Component } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddCircuitFactureComponent } from '../add-circuit-facture/add-circuit-facture.component';
  import { EditCircuitFactureComponent } from '../edit-circuit-facture/edit-circuit-facture.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  @Component({
    selector: 'app-list-circuit-facture',
    standalone: true, // Composant autonome
    imports: [AddCircuitFactureComponent,EditCircuitFactureComponent], // Dépendances importées
    templateUrl: './list-circuit-facture.component.html',
    styleUrls: ['./list-circuit-facture.component.css']
  })
  export class ListCircuitFactureComponent {
    loading_get_circuit_facture = false
    les_circuit_factures: any[] = []
    selected_circuit_facture: any = undefined
    circuit_facture_to_edit: any = undefined
    loading_delete_circuit_facture = false
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      this.get_circuit_facture()
    }
    get_circuit_facture() {
      this.loading_get_circuit_facture = true;
      this.api.taf_post("circuit_facture/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_circuit_factures = reponse.data
          console.log("Opération effectuée avec succés sur la table circuit_facture. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table circuit_facture a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_circuit_facture = false;
      }, (error: any) => {
        this.loading_get_circuit_facture = false;
      })
    }
  
    voir_plus(one_circuit_facture: any) {
      this.selected_circuit_facture = one_circuit_facture
    }
    on_click_edit(one_circuit_facture: any) {
      this.circuit_facture_to_edit = one_circuit_facture
    }
    on_close_modal_edit(){
      this.circuit_facture_to_edit=undefined
    }
    delete_circuit_facture (circuit_facture : any){
      this.loading_delete_circuit_facture = true;
      this.api.taf_post("circuit_facture/delete", circuit_facture,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table circuit_facture . Réponse = ",reponse)
          this.get_circuit_facture()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table circuit_facture  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_circuit_facture = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_circuit_facture = false;
      })
    }
    openModal_add_circuit_facture() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddCircuitFactureComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_circuit_facture()
        } else {

        }
      })
    }
    openModal_edit_circuit_facture(one_circuit_facture: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditCircuitFactureComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.circuit_facture_to_edit = one_circuit_facture;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_circuit_facture()
        } else {

        }
      })
    }
  }