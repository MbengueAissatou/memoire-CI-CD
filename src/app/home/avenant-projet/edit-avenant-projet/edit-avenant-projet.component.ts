
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-edit-avenant-projet',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './edit-avenant-projet.component.html',
  styleUrls: ['./edit-avenant-projet.component.css']
})
export class EditAvenantProjetComponent {
  reactiveForm_edit_avenant_projet !: FormGroup;
  submitted: boolean = false
  loading_edit_avenant_projet: boolean = false
  @Input()
  avenant_projet_to_edit: any = {}
  @Output()
cb_after_edit_avenant = new EventEmitter()
  form_details: any = {}
  loading_get_details_edit_avenant_projet_form = false
  les_fichier_contrat: any[] = [];
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    this.get_details_edit_avenant_projet_form()
    this.update_form(this.avenant_projet_to_edit)
  }
  // mise à jour du formulaire
  update_form(avenant_projet_to_edit: any) {
    this.reactiveForm_edit_avenant_projet = this.formBuilder.group({
      id_projet: [avenant_projet_to_edit.id_projet, Validators.required],
      montant: [avenant_projet_to_edit.montant, Validators.required],
      ordre_service: [avenant_projet_to_edit.ordre_service, Validators.required],
      date_fin: [avenant_projet_to_edit.date_fin, Validators.required],
      numero_contrat: [avenant_projet_to_edit.numero_contrat, Validators.required],

      id_bailleur: [avenant_projet_to_edit.id_bailleur || ""],
      pourcentage_avd: [avenant_projet_to_edit.pourcentage_avd || ""],
      date_expiration_avd: [avenant_projet_to_edit.date_expiration_avd || ""],
      numero_caution: [avenant_projet_to_edit.numero_caution || ""],

      fichier_contrat: [""],
      id_etat_avenant: [avenant_projet_to_edit.id_etat_avenant, Validators.required],
      motif: [avenant_projet_to_edit.motif],
    });

    if (avenant_projet_to_edit.id_bailleur) {
      this.reactiveForm_edit_avenant_projet.get("id_bailleur")?.addValidators(Validators.required);
      //  this.reactiveForm_edit_avenant_projet.get("pourcentage_avd")?.addValidators(Validators.required);
      //  this.reactiveForm_edit_avenant_projet.get("date_expiration_avd")?.addValidators(Validators.required);
      //  this.reactiveForm_edit_avenant_projet.get("numero_caution")?.addValidators(Validators.required);
      this.reactiveForm_edit_avenant_projet.updateValueAndValidity();
    }
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_avenant_projet.controls; }
  // validation du formulaire
  onSubmit_edit_avenant_projet() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_avenant_projet.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_avenant_projet.invalid) {
      return;
    }
    // var avenant_projet = this.reactiveForm_edit_avenant_projet.value
    this.edit_avenant_projet(this.format_with_form_data())
  }
  // vider le formulaire
  onReset_edit_avenant_projet() {
    this.submitted = false;
    this.reactiveForm_edit_avenant_projet.reset();
  }
  edit_avenant_projet(avenant_projet: any) {
    console.warn(avenant_projet);
    // return;
    this.loading_edit_avenant_projet = true;
    this.api.taf_post("avenant/edit_with_file", avenant_projet, (reponse: any) => {
      if (reponse.status) {
        this.cb_after_edit_avenant.emit({
          status: true,
          avenant: reponse.data
        })
        this.activeModal.close(reponse)
        console.log("Opération effectuée avec succés sur la table avenant_projet. Réponse= ", reponse);
        //this.onReset_edit_avenant_projet()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table avenant_projet a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_avenant_projet = false;
    }, (error: any) => {
      this.loading_edit_avenant_projet = false;
    })
  }
  get_details_edit_avenant_projet_form() {
    this.loading_get_details_edit_avenant_projet_form = true;
    this.api.taf_post("avenant/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table avenant_projet. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table avenant_projet a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_avenant_projet_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_avenant_projet_form = false;
    })
  }

  format_with_form_data() {
    const form_data_final = new FormData();
    const form_group = this.reactiveForm_edit_avenant_projet.value;

    const data: any = {};

    // Convert form_group en un objet simple
    for (let key in form_group) {
      data[key] = form_group[key];
    }

    // Ajouter les fichiers séparément au form_data_final
    for (let one_fichier_contrat of this.les_fichier_contrat) {
      form_data_final.append('les_fichier_contrat[]', one_fichier_contrat);
    }

    // Ajout des parties JSON en string
    form_data_final.append("data", JSON.stringify(data));
    let condition: any = { id_avenant: this.avenant_projet_to_edit.id_avenant };
    form_data_final.append("condition", JSON.stringify(condition));

    console.log("form_data_final ready to send:", form_data_final);
    return form_data_final;
  }



  on_file_selected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        // Vous pouvez ajouter ici une logique pour gérer les types de fichiers, si nécessaire
        console.log('Fichier sélectionné:', file);
        this.les_fichier_contrat.push(file);
      }
    }
  }
}
