import { Component } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddPrivilegeComponent } from '../add-privilege/add-privilege.component';
  import { EditPrivilegeComponent } from '../edit-privilege/edit-privilege.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  @Component({
    selector: 'app-list-privilege',
    standalone: true, // Composant autonome
    imports: [AddPrivilegeComponent,EditPrivilegeComponent], // Dépendances importées
    templateUrl: './list-privilege.component.html',
    styleUrls: ['./list-privilege.component.css']
  })
  export class ListPrivilegeComponent {
    loading_get_privilege = false
    les_privileges: any[] = []
    selected_privilege: any = undefined
    privilege_to_edit: any = undefined
    loading_delete_privilege = false
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      this.get_privilege()
    }
    get_privilege() {
      this.loading_get_privilege = true;
      this.api.taf_post("privilege/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_privileges = reponse.data
          console.log("Opération effectuée avec succés sur la table privilege. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table privilege a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_privilege = false;
      }, (error: any) => {
        this.loading_get_privilege = false;
      })
    }
  
    voir_plus(one_privilege: any) {
      this.selected_privilege = one_privilege
    }
    on_click_edit(one_privilege: any) {
      this.privilege_to_edit = one_privilege
    }
    on_close_modal_edit(){
      this.privilege_to_edit=undefined
    }
    delete_privilege (privilege : any){
      this.loading_delete_privilege = true;
      this.api.taf_post("privilege/delete", privilege,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table privilege . Réponse = ",reponse)
          this.get_privilege()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table privilege  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_privilege = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_privilege = false;
      })
    }
    openModal_add_privilege() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddPrivilegeComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_privilege()
        } else {

        }
      })
    }
    openModal_edit_privilege(one_privilege: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditPrivilegeComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.privilege_to_edit = one_privilege;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_privilege()
        } else {

        }
      })
    }
  }