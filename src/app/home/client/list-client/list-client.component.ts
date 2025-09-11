import { Component, TemplateRef } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddClientComponent } from '../add-client/add-client.component';
import { EditClientComponent } from '../edit-client/edit-client.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgClass, NgIf, NgIfContext } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchServiceService } from 'src/app/service/searchService/search-service.service';
import { FormsModule } from '@angular/forms';
import { ListPaysComponent } from '../../pays/list-pays/list-pays.component';
@Component({
  selector: 'app-list-client',
  standalone: true, // Composant autonome
  imports: [AddClientComponent, EditClientComponent, NgIf, NgClass, RouterLink, FormsModule, CommonModule], // Dépendances importées
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.css']
})
export class ListClientComponent {
  loading_get_client = false
  les_clients: any[] = []
  selected_client: any = undefined
  client_to_edit: any = undefined
  loading_delete_client = false
  // noResults: TemplateRef<NgIfContext<boolean>>|null;
  constructor(public api: ApiService, private modalService: NgbModal, public searchService: SearchServiceService) {
    // Initialisation du composant
    // this.get_client();

  }
  ngOnInit(): void {
     this.get_client()
  }
  get_client() {
    this.loading_get_client = true;
    this.api.taf_post("client/get", {}, (reponse: any) => {
      if (reponse.status) {
        this.les_clients = reponse.data
        this.searchService.data = this.les_clients; // Mettre à jour les données de recherche
        this.searchService.filter_change();
        console.log("Opération effectuée avec succés sur la table client. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table client a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_client = false;
    }, (error: any) => {
      this.loading_get_client = false;
    })
  }

  voir_plus(one_client: any) {
    this.selected_client = one_client
  }
  on_click_edit(one_client: any) {
    this.client_to_edit = one_client
  }
  on_close_modal_edit() {
    this.client_to_edit = undefined
  }
  delete_client(client: any) {
    this.loading_delete_client = true;
    this.api.taf_post("client/delete", client, (reponse: any) => {
      //when success
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table client . Réponse = ", reponse)
        this.get_client()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table client  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_client = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_client = false;
      })
  }
  openModal_add_client() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(AddClientComponent, { ...options, backdrop: 'static' })
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_client()
      } else {

      }
    })
  }
  openModal_edit_client(one_client: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditClientComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.client_to_edit = one_client;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_client()
      } else {

      }
    })
  }
  openModal_list_pays() {
     this.get_client(); 
      let options: any = {
      centered: true,         
      scrollable: true,       
      size: 'xl',            
      backdrop: 'static',     
      keyboard: false,        
      animation: true,        
      windowClass: 'custom-modal-class', // tu peux utiliser ça pour styliser via CSS
    };
    const modalRef = this.modalService.open(ListPaysComponent, { ...options, backdrop: 'static' });
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
         this.get_client();
      }
    })
    .catch(() => {
    // Optionnel : fermeture sans action
    console.log("Modal fermé sans action");
    }
  )
  }
}
