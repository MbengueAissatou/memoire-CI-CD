import { Component, effect, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddFactureComponent } from '../add-facture/add-facture.component';
import { EditFactureComponent } from '../edit-facture/edit-facture.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { DetailsFactureComponent } from '../details-facture/details-facture.component';
@Component({
  selector: 'app-list-facture',
  standalone: true, // Composant autonome
  imports: [AddFactureComponent, EditFactureComponent, RouterLink, NgClass, NgIf], // Dépendances importées
  templateUrl: './list-facture.component.html',
  styleUrls: ['./list-facture.component.css']
})
export class ListFactureComponent  {
  @Output()
  cb_after_change = new EventEmitter();
  loading_get_facture = false
  les_factures: any[] = []
  selected_facture: any = undefined
  facture_to_edit: any = undefined
  loading_delete_facture = false
  id_projet: any;
  id_facture: string | null = null;
  constructor(public api: ApiService, private modalService: NgbModal, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const id_projet = params.get('id_projet');
      this.id_facture = params.get('id_facture');

      if (id_projet) {
        this.id_projet = id_projet;
        this.api.id_projet.set(id_projet);
      }
    })

  }
  ngOnInit(): void {
    this.id_projet = this.api.id_projet();
    //   alert(this.api.id_projet())
    this.get_facture()
  }
  get_facture() {
    this.loading_get_facture = true;
    this.api.taf_post("facture/get_2", { id_projet: this.id_projet }, (reponse: any) => {
      if (reponse.status) {
        this.les_factures = reponse.data.reduce((cumul: any, actu: any) => {
          let copy = Object.assign({}, actu);
          let is_index = cumul.findIndex((one_facture: any) => one_facture.id_facture == actu.id_facture);
          if (is_index !== -1) {
            cumul[is_index].total_pourcentage_partenaire += actu.pourcentage_partenaire || 0;
            cumul[is_index].les_details.push(actu)
          } else {
            copy.total_pourcentage_partenaire = actu.pourcentage_partenaire || 0
            copy.les_details = [actu]
            cumul.push(copy);
          }
          return cumul
        }, []);
        //  this.cb_after_change.emit({status:true}); // <- notifie le parent
        // this.cb_after_change.emit({ status: true, factures: this.les_factures });
        if (this.id_facture) {
          setTimeout(() => {
            const element = document.getElementById('facture_' + this.id_facture);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              element.classList.add('facture-highlight');

              // 🔄 Retirer la classe après 3 secondes
              setTimeout(() => {
                element.classList.remove('facture-highlight');
              }, 3000);
            }
          }, 300);
        }


        console.log("Opération effectuée avec succés sur la table facture. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table facture a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_facture = false;
    }, (error: any) => {
      this.loading_get_facture = false;
    })
  }

  voir_plus(one_facture: any) {
    this.selected_facture = one_facture
  }
  on_click_edit(one_facture: any) {
    this.facture_to_edit = one_facture
  }
  on_close_modal_edit() {
    this.facture_to_edit = undefined
  }
  delete_facture(facture: any) {
    this.loading_delete_facture = true;
    this.api.taf_post("facture/delete", facture, (reponse: any) => {
      //when success
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table facture . Réponse = ", reponse)
        this.get_facture()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.cb_after_change.emit({ status: true }); // <- notifie le parent
      } else {
        console.log("L'opération sur la table facture  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_facture = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_facture = false;
      })
  }

  openModal_add_facture() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(AddFactureComponent, { ...options, backdrop: 'static', })
    // modalRef.componentInstance.facture_to_edit = one_facture;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_facture()
        this.cb_after_change.emit({ status: true }); // <- notifie le parent
      } else {

      }
    })
  }
  openModal_edit_facture(one_facture: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditFactureComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.facture_to_edit = one_facture;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_facture()
        this.cb_after_change.emit({ status: true }); // <- notifie le parent
      } else {

      }
    })
  }
  openModal_detail_facture(one_facture: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(DetailsFactureComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.facture = one_facture;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        // this.get_facture()
      } else {

      }
    })
  }
}
