import { Component } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddProjetComponent } from '../add-projet/add-projet.component';
import { EditProjetComponent } from '../edit-projet/edit-projet.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { SearchServiceService } from 'src/app/service/searchService/search-service.service';
import { ListBailleurComponent } from '../../bailleur/list-bailleur/list-bailleur.component';
import { ListCelluleComponent } from '../../cellule/list-cellule/list-cellule.component';
import { ListEtatProjetComponent } from '../../etat-projet/list-etat-projet/list-etat-projet.component';
import { groupBy } from 'lodash';

@Component({
  selector: 'app-list-projet',
  standalone: true, // Composant autonome
  imports: [AddProjetComponent, EditProjetComponent, RouterLink, NgIf, NgClass, CommonModule], // Dépendances importées
  templateUrl: './list-projet.component.html',
  styleUrls: ['./list-projet.component.css']
})
export class ListProjetComponent {
  loading_get_projet = false
  les_projets: any[] = []
  selected_projet: any = undefined
  projet_to_edit: any = undefined
  loading_delete_projet = false

  filter: any = {
    text: [],
    group_by: 'etat_projet' // Default grouping by zone
  };
  list: any[] = [];
  list_grouped: Record<string, any[]> = {};
  cellules_filtres: any[] = [];
  donnees_select: any;
  group_by_labels: any = {
    bailleur: 'Bailleur',
    cellule: 'Cellule',
    etat_projet: 'État du projet',
    client: 'Client'

  };
  loading_get_notification = false;
  les_notifications: any = [];

  constructor(public api: ApiService, private modalService: NgbModal, public searchService: SearchServiceService) {


  }
  ngOnInit(): void {
    this.get_projet();
    this.get_notification();

  }
  get_projet() {
    this.loading_get_projet = true;
    this.api.taf_post("projet/get", {}, (reponse: any) => {
      if (reponse.status) {
        this.les_projets = reponse.data.reduce((cumul: any, actu: any) => {
          let copy = Object.assign({}, actu);
          let is_index = cumul.findIndex((one_projet: any) => one_projet.id_projet == actu.id_projet);
          if (is_index !== -1) {
            if (copy.id_partenaire) {
              cumul[is_index].les_partenaires.push({ id_partenaire: copy.id_partenaire, pourcentage_partenaire: copy.pourcentage_partenaire, nom_partenaire: copy.nom_partenaire })
            }
          } else {
            if (copy.id_partenaire) {
              copy.les_partenaires = [{ id_partenaire: copy.id_partenaire, pourcentage_partenaire: copy.pourcentage_partenaire, nom_partenaire: copy.nom_partenaire }]
            } else {
              copy.les_partenaires = [];
            }
            cumul.push(copy);
          }

          return cumul
        }, []);
        this.filter_change();

        console.log('les_projest : ', this.les_projets)
        console.log("Opération effectuée avec succés sur la table projet. Réponse= ", this.les_projets);
        console.log("Opération effectuée avec succés sur la table projet. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table projet a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_projet = false;
    }, (error: any) => {
      this.loading_get_projet = false;
    })
  }
  get_notification() {
    this.loading_get_notification = true;
    this.api.taf_post("notification/get", {}, (reponse: any) => {
      if (reponse.status) {
        this.les_notifications = reponse.data
        console.log("Opération effectuée avec succés sur la table notification. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table notification a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_notification = false;
    }, (error: any) => {
      this.loading_get_notification = false;
    })
  }

  voir_plus(one_projet: any) {
    this.selected_projet = one_projet
  }
  on_click_edit(one_projet: any) {
    this.projet_to_edit = one_projet
  }
  on_close_modal_edit() {
    this.projet_to_edit = undefined
  }
  delete_projet(projet: any) {
    this.loading_delete_projet = true;
    this.api.taf_post("projet/delete", projet, (reponse: any) => {
      //when success
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table projet . Réponse = ", reponse)
        this.get_projet()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table projet  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_projet = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_projet = false;
      })
  }
  openModal_add_projet() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(AddProjetComponent, { ...options, backdrop: 'static' })
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_projet()
      } else {

      }
    })
  }
  openModal_edit_projet(one_projet: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditProjetComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.projet_to_edit = one_projet;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_projet()
      } else {

      }
    })
  }
  openModal_list_bailleur() {
    this.get_projet(); // ou une méthode pour préparer les données
    let options: any = {
      centered: true,
      scrollable: true,
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      animation: true,
      windowClass: 'custom-modal-class', // tu peux utiliser ça pour styliser via CSS
    };
    const modalRef = this.modalService.open(ListBailleurComponent, { ...options, backdrop: 'static' });
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_projet();
      }
    });
  }
  openModal_list_cellule() {
    // this.get_projet(); // ou une méthode pour préparer les données
    let options: any = {
      centered: true,         // centre le modal verticalement
      scrollable: true,       // permet de scroller à l'intérieur du modal
      size: 'xl',             // taille : sm | lg | xl | string personnalisée
      backdrop: 'static',     // empêche la fermeture en cliquant en dehors
      keyboard: false,        // empêche la fermeture avec la touche "Échap"
      animation: true,        // animation de fade (par défaut activé)
      windowClass: 'custom-modal-class', // tu peux utiliser ça pour styliser via CSS
    };
    const modalRef = this.modalService.open(ListCelluleComponent, { ...options, backdrop: 'static' });
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        // this.get_projet();
      }
    });
  }
  openModal_list_etat_projet() {
    // this.get_projet(); // ou une méthode pour préparer les données
    let options: any = {
      centered: true,         // centre le modal verticalement
      scrollable: true,       // permet de scroller à l'intérieur du modal
      size: 'lg',             // taille : sm | lg | xl | string personnalisée
      backdrop: 'static',     // empêche la fermeture en cliquant en dehors
      keyboard: false,        // empêche la fermeture avec la touche "Échap"
      animation: true,        // animation de fade (par défaut activé)
      windowClass: 'custom-modal-class', // tu peux utiliser ça pour styliser via CSS
    };
    const modalRef = this.modalService.open(ListEtatProjetComponent, { ...options, backdrop: 'static' });
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        // this.get_projet();
      }
    });
  }
  getColor(etat: number): string {
    switch (etat) {
      case 1: return 'secondary';
      case 2: return 'warning';
      case 3: return 'success';
      case 4: return 'danger';
      default: return 'primary';
    }
  }
  filter_change(event?: any) {
    console.log("Current filter values: ", this.filter);
    this.list = this.les_projets.filter((one: any) => {
      let search = !event?.term || JSON.stringify(one).toLowerCase().replace(/\s/g, '')
        .includes(event?.term?.toLowerCase().replace(/\s/g, ''))
      let filtre_objet: any = {}

      let text = !this.filter.text || this.filter.text.length == 0
        || this.filter.text.filter((one_filtre: string) => {
          let bailleur = !one_filtre.startsWith('bailleur_') || (one_filtre.startsWith('bailleur_') && one_filtre.replace('bailleur_', '') == one.id_bailleur)
          let cellule = !one_filtre.startsWith('cellule_') || (one_filtre.startsWith('cellule_') && one_filtre.replace('cellule_', '') == one.id_cellule)
          let client = !one_filtre.startsWith('client_') || (one_filtre.startsWith('client_') && one_filtre.replace('client_', '') == one.id_cellule)



          // Incrémenter les compteurs
          if (one_filtre.startsWith('bailleur_')) filtre_objet.bailleur_ = (filtre_objet.bailleur_ || 0) + 1
          if (one_filtre.startsWith('cellule_')) filtre_objet.cellule_ = (filtre_objet.cellule_ || 0) + 1
          if (one_filtre.startsWith('client_')) filtre_objet.client_ = (filtre_objet.client_ || 0) + 1;


        }).length >= Object.keys(filtre_objet).length

      return search && text
    })
    if (['bailleur', 'cellule', 'client'].includes(this.filter.group_by)) {
      // 1. Produire un tableau « aplati » de paires { bailleur, projet }
      const pairs = this.list.flatMap(projet =>
        (projet[this.filter.group_by] || '')
          .split(',')
          .map((e: any) => e.trim())
          // .filter((e: any) => e.length > 0)
          .map((nomEnt: any) => ({ nomEnt, ...projet }))
      );
      this.list_grouped = groupBy(pairs, item => item.nomEnt);
    } else {
      this.list_grouped = groupBy(this.list, item => item[this.filter.group_by]);
    }

    // this.onZoneChange()
    this.api.update_preference("list_projet.filter", this.filter);
  }

  group_by_change() {
    switch (this.filter.group_by) {

      case 'bailleur':
        this.filter.group_by = 'cellule';
        break;
      case 'cellule':
        this.filter.group_by = 'etat_projet';
        break;
      case 'etat_projet':
        this.filter.group_by = 'client';
        break;
      case 'client':
        this.filter.group_by = 'bailleur';
        break;
      default:
        this.filter.id_bailleur = '';
        break
    }
    this.filter_change()
  }


}
