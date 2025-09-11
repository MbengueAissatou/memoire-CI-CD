
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-projet',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './add-projet.component.html',
  styleUrls: ['./add-projet.component.css']
})
export class AddProjetComponent {
  reactiveForm_add_projet !: FormGroup;
  submitted: boolean = false
  loading_add_projet: boolean = false
  form_details: any = {}
  loading_get_details_add_projet_form = false
  is_partenaire = false;
  les_types_remuneration: any = ['forfaitaire', 'au temps passé'];
  les_fichier_contrat: any[] = [];
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.get_details_add_projet_form()
    this.init_form()
  }
  init_form() {
    this.reactiveForm_add_projet = this.formBuilder.group({
      id_utilisateur: [this.api.token.token_decoded.taf_data.id_privilege, Validators.required],
      id_cellule: ["", Validators.required],
      id_client: ["", Validators.required],
      id_etat_projet: ["1", Validators.required],
      nom: ["", Validators.required],
      code_projet: ["", Validators.required],
      delais_reglement_facture: ["", Validators.required],
      condition_facture: ["", Validators.required],
      type_remuneration: ["", Validators.required],



      ordre_service: [this.api.format_current_date().jma3, Validators.required],
      date_fin: ["", Validators.required],
      id_bailleur: ["", Validators.required],
      montant: ["", Validators.required],
      numero_contrat: ["", Validators.required],
      pourcentage_avd: [""],
      date_expiration_avd: [""],
      numero_caution: [""],
      fichier_contrat: [""],
      id_etat_avenant: ["", Validators.required],

      // partenaire
      les_partenaires: this.formBuilder.array([])
    });
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      id_partenaire: ["", Validators.required],
      pourcentage_partenaire: ["", [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }

  // Ajouter un nouveau formulaire de matière première au tableau
  onAddForm() {
    (this.f.les_partenaires as FormArray).push(this.createForm());
  }

  // Supprimer un formulaire de matière première du tableau
  onRemoveForm(index: number) {
    (this.f.les_partenaires as FormArray).removeAt(index);
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_projet.controls; }
  // validation du formulaire
  onSubmit_add_projet() {
    this.submitted = true;
    console.log(this.reactiveForm_add_projet.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_projet.invalid) {
      return;
    }
    var projet = this.reactiveForm_add_projet.value
    this.add_projet(projet)
  }
  // vider le formulaire
  onReset_add_projet() {
    this.submitted = false;
    this.reactiveForm_add_projet.reset();
  }
  add_projet(projet_in: any) {
    this.loading_add_projet = true;

    // const { id_utilisateur, id_cellule, id_client, id_etat_projet, nom, code_projet, delais_reglement_facture, condition_facture, type_remuneration, ...rest } = projet_in;
    // const projet = { id_utilisateur, id_cellule, id_client, id_etat_projet, nom, code_projet, delais_reglement_facture, condition_facture, type_remuneration };
    // const { les_partenaires, ...avenant } = rest;
    // console.warn({ projet: projet, avenant: avenant, les_partenaires: les_partenaires,les_fichiers:JSON.stringify(this.format_with_form_data()) });
    let projet = this.format_with_form_data(projet_in)
    console.warn(projet);
    // return;
    this.api.taf_post("projet/add_many_with_file", projet, (reponse: any) => {
      this.loading_add_projet = false;
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table projet. Réponse= ", reponse);
        this.onReset_add_projet()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.close(reponse)
        this.get_details_add_projet_form();
      } else {
        console.log("L'opération sur la table projet a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_projet = false;
    })
  }

  get_details_add_projet_form() {
    this.loading_get_details_add_projet_form = true;
    this.api.taf_post("projet/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table projet. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table projet a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_projet_form = false;
    }, (error: any) => {
      this.loading_get_details_add_projet_form = false;
    })
  }

  switch_is_partenaire() {
    this.is_partenaire = !this.is_partenaire;
    const id_partenaire = this.reactiveForm_add_projet.get('id_partenaire');
    const pourcentage_partenaire = this.reactiveForm_add_projet.get('pourcentage_partenaire');
    if (this.is_partenaire) {
      id_partenaire?.setValidators(Validators.required);
      pourcentage_partenaire?.setValidators(Validators.required);
    } else {
      id_partenaire?.removeValidators(Validators.required);
      pourcentage_partenaire?.removeValidators(Validators.required);
    }
    this.reactiveForm_add_projet.updateValueAndValidity()
  }

  on_file_selected(event: any) {
    const files = event.target.files
    this.les_fichier_contrat = [];
    for (let i = 0; i < files.length; i++) {
      this.les_fichier_contrat.push(files[i]);
    }
    console.warn(this.les_fichier_contrat);
  }

  format_with_form_data(projet_in: any) {
    const form_data = new FormData();

    // Séparer les différentes parties
    const { id_utilisateur, id_cellule, id_client, id_etat_projet, nom, code_projet, delais_reglement_facture, condition_facture, type_remuneration, ...rest } = projet_in;
    const projet = { id_utilisateur, id_cellule, id_client, id_etat_projet, nom, code_projet, delais_reglement_facture, condition_facture, type_remuneration };
    const { les_partenaires, ...avenant } = rest;

    // Ajouter les objets JSON sous forme de chaînes
    form_data.append("projet", JSON.stringify(projet));
    form_data.append("avenant", JSON.stringify(avenant));
    form_data.append("les_partenaires", JSON.stringify(les_partenaires));

    // Ajouter les fichiers un par un
    for (let one_fichier of this.les_fichier_contrat) {
      form_data.append("les_fichiers[]", one_fichier);
    }

    return form_data;
  }

}
