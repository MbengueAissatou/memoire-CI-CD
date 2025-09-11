import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SafePipe } from 'src/app/pipes/safe.pipe';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-details-avenant',
  imports: [NgIf, SafePipe],
  templateUrl: './details-avenant.component.html',
  styleUrl: './details-avenant.component.css'
})
export class DetailsAvenantComponent {
  loading_get_detail_projet = false
  loading_get_fichiers = false
  loading_delete_fichier = false
  selected_projet: any = undefined
  les_avenants: any = undefined
  les_stats: any = undefined
  les_fichiers: any = [];
  @Input() one_avenant: any;

  constructor(public api: ApiService, private modalService: NgbModal, private route: ActivatedRoute, public activeModal: NgbActiveModal, private sanitizer: DomSanitizer) {

  }
  ngOnInit(): void {
    // console.warn(this.one_avenant)
    this.get_stats_projet(this.one_avenant.id_avenant)
  }

  get_stats_projet(id: any) {
    this.loading_get_fichiers = true;
    this.api.taf_post("fichier/get", { id_avenant: +id }, (reponse: any) => {
      if (reponse.status) {
        this.les_fichiers = reponse.data;
        console.log("Opération effectuée avec succés sur la table stats. Réponse= ", this.les_fichiers);
        console.log("Opération effectuée avec succés sur la table fichier. Réponse= ", this.les_fichiers);
      } else {
        console.log("L'opération sur la table stats a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_fichiers = false;
    }, (error: any) => {
      this.loading_get_fichiers = false;
    })
  }

  format_file_name(file_name: any) {
    // Supprimer tout avant et y compris le premier "_"
    const newName = file_name.substring(file_name.indexOf('_') + 1);
    return newName;
  }



  getSafeViewerUrl(filename: string): SafeResourceUrl {
    const fullUrl = this.api.taf_base_url + 'avenant/fichier/' + filename;
    const isWord = filename.endsWith('.doc') || filename.endsWith('.docx');
    const isExcel = filename.endsWith('.xls') || filename.endsWith('.xlsx')|| filename.endsWith('.csv');
    const isImage = /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(filename);

    let finalUrl: string;

    if (isWord) {
      finalUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fullUrl)}`;
    } else if (isExcel) {
      finalUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fullUrl)}`;
    } else if (isImage) {
      finalUrl = fullUrl; // Les images peuvent être directement affichées
    } else {
      finalUrl = fullUrl; // Pour d'autres types de fichiers, on retourne l'URL directe
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }

  delete_fichier(fichier: any, event: MouseEvent) {
    event.stopPropagation();
    this.api.Swal_confirm(
        'Voulez-vous vraiment supprimer ce fichier ?',
        { confirmButtonText: 'Oui', cancelButtonText: 'Annuler' }
    ).then((result: any) => {
        if (result.isConfirmed) {
            this.loading_delete_fichier = true;
            this.api.taf_post("fichier/delete", fichier, (reponse: any) => {
                if (reponse.status) {
                  this.get_stats_projet(fichier.id_avenant);
                    console.log("Opération effectuée avec succès sur la table fichier. Réponse = ", reponse);
                    this.les_fichiers = this.les_fichiers.filter((item:any) => item.id !== fichier.id);
                    this.api.Swal_success("Opération effectuée avec succès");
                } else {
                    console.log("L'opération sur la table fichier a échoué. Réponse = ", reponse);
                    this.api.Swal_error("L'opération a échoué");
                }
                this.loading_delete_fichier = false;
            },
            (error: any) => {
                console.log("Erreur inconnue ! ", error);
                this.loading_delete_fichier = false;
            });
        }
    });
}
}
