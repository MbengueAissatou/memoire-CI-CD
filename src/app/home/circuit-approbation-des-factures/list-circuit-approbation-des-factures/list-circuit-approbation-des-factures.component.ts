import { Component } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddCircuitApprobationDesFacturesComponent } from '../add-circuit-approbation-des-factures/add-circuit-approbation-des-factures.component';
  import { EditCircuitApprobationDesFacturesComponent } from '../edit-circuit-approbation-des-factures/edit-circuit-approbation-des-factures.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
  @Component({
    selector: 'app-list-circuit-approbation-des-factures',
    standalone: true, // Composant autonome
    imports: [AddCircuitApprobationDesFacturesComponent,EditCircuitApprobationDesFacturesComponent,NgIf], // Dépendances importées
    templateUrl: './list-circuit-approbation-des-factures.component.html',
    styleUrls: ['./list-circuit-approbation-des-factures.component.css']
  })
  export class ListCircuitApprobationDesFacturesComponent {
    loading_get_circuit_approbation_des_factures = false
    les_circuit_approbation_des_facturess: any[] = []
    selected_circuit_approbation_des_factures: any = undefined
    circuit_approbation_des_factures_to_edit: any = undefined
    loading_delete_circuit_approbation_des_factures = false
    constructor(public api: ApiService,private modalService: NgbModal) {

    }
    ngOnInit(): void {
      this.get_circuit_approbation_des_factures()
    }
    get_circuit_approbation_des_factures() {
      this.loading_get_circuit_approbation_des_factures = true;
      this.api.taf_post("circuit_approbation_des_factures/get", {id_projet:this.api.id_projet()}, (reponse: any) => {
        if (reponse.status) {
          this.les_circuit_approbation_des_facturess = reponse.data
          console.log("Opération effectuée avec succés sur la table circuit_approbation_des_factures. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table circuit_approbation_des_factures a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_circuit_approbation_des_factures = false;
      }, (error: any) => {
        this.loading_get_circuit_approbation_des_factures = false;
      })
    }

    voir_plus(one_circuit_approbation_des_factures: any) {
      this.selected_circuit_approbation_des_factures = one_circuit_approbation_des_factures
    }
    on_click_edit(one_circuit_approbation_des_factures: any) {
      this.circuit_approbation_des_factures_to_edit = one_circuit_approbation_des_factures
    }
    on_close_modal_edit(){
      this.circuit_approbation_des_factures_to_edit=undefined
    }
    delete_circuit_approbation_des_factures (circuit_approbation_des_factures : any){
      this.loading_delete_circuit_approbation_des_factures = true;
      this.api.taf_post("circuit_approbation_des_factures/delete", circuit_approbation_des_factures,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table circuit_approbation_des_factures . Réponse = ",reponse)
          this.get_circuit_approbation_des_factures()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table circuit_approbation_des_factures  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_circuit_approbation_des_factures = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_circuit_approbation_des_factures = false;
      })
    }
    openModal_add_circuit_approbation_des_factures() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddCircuitApprobationDesFacturesComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_circuit_approbation_des_factures()
        } else {

        }
      })
    }
    openModal_edit_circuit_approbation_des_factures(one_circuit_approbation_des_factures: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditCircuitApprobationDesFacturesComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.circuit_approbation_des_factures_to_edit = one_circuit_approbation_des_factures;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_circuit_approbation_des_factures()
        } else {

        }
      })
    }
  }
