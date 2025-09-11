
  import { Component, EventEmitter, Input, Output } from '@angular/core';
  import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
  import { ApiService } from '../../../service/api/api.service';
  import { CommonModule } from '@angular/common';
  import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
  @Component({
    selector: 'app-edit-partenaire-projet',
    standalone: true, // Composant autonome
    imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
    templateUrl: './edit-partenaire-projet.component.html',
    styleUrls: ['./edit-partenaire-projet.component.css']
  })
  export class EditPartenaireProjetComponent {
    reactiveForm_edit_partenaire_projet !: FormGroup;
    submitted: boolean = false
    loading_edit_partenaire_projet: boolean = false
    @Input()
    partenaire_projet_to_edit: any = {}
    form_details: any = {}
    loading_get_details_edit_partenaire_projet_form = false
    constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
        
    }
    ngOnInit(): void {
        this.get_details_edit_partenaire_projet_form()
        this.update_form(this.partenaire_projet_to_edit)
    }
    // mise à jour du formulaire
    update_form(partenaire_projet_to_edit:any) {
        this.reactiveForm_edit_partenaire_projet = this.formBuilder.group({
            id_projet : [partenaire_projet_to_edit.id_projet, Validators.required],
id_partenaire : [partenaire_projet_to_edit.id_partenaire, Validators.required],
pourcentage_montant_base : [partenaire_projet_to_edit.pourcentage_montant_base],
updated_at : [partenaire_projet_to_edit.updated_at, Validators.required]
        });
    }
  
    // acces facile au champs de votre formulaire
    get f(): any { return this.reactiveForm_edit_partenaire_projet .controls; }
    // validation du formulaire
    onSubmit_edit_partenaire_projet() {
        this.submitted = true;
        console.log(this.reactiveForm_edit_partenaire_projet.value)
        // stop here if form is invalid
        if (this.reactiveForm_edit_partenaire_projet.invalid) {
            return;
        }
        var partenaire_projet = this.reactiveForm_edit_partenaire_projet.value
        this.edit_partenaire_projet({
        condition:JSON.stringify({id_partenaire_projet:this.partenaire_projet_to_edit.id_partenaire_projet}),
        data:JSON.stringify(partenaire_projet)
        })
    }
    // vider le formulaire
    onReset_edit_partenaire_projet() {
        this.submitted = false;
        this.reactiveForm_edit_partenaire_projet.reset();
    }
    edit_partenaire_projet(partenaire_projet: any) {
        this.loading_edit_partenaire_projet = true;
        this.api.taf_post("partenaire_projet/edit", partenaire_projet, (reponse: any) => {
            if (reponse.status) {
                this.activeModal.close(reponse)
                console.log("Opération effectuée avec succés sur la table partenaire_projet. Réponse= ", reponse);
                //this.onReset_edit_partenaire_projet()
                this.api.Swal_success("Opération éffectuée avec succés")
            } else {
                console.log("L'opération sur la table partenaire_projet a échoué. Réponse= ", reponse);
                this.api.Swal_error("L'opération a echoué")
            }
            this.loading_edit_partenaire_projet = false;
        }, (error: any) => {
            this.loading_edit_partenaire_projet = false;
        })
    }
    get_details_edit_partenaire_projet_form() {
        this.loading_get_details_edit_partenaire_projet_form = true;
        this.api.taf_post("partenaire_projet/get_form_details", {}, (reponse: any) => {
          if (reponse.status) {
            this.form_details = reponse.data
            console.log("Opération effectuée avec succés sur la table partenaire_projet. Réponse= ", reponse);
          } else {
            console.log("L'opération sur la table partenaire_projet a échoué. Réponse= ", reponse);
            this.api.Swal_error("L'opération a echoué")
          }
          this.loading_get_details_edit_partenaire_projet_form = false;
        }, (error: any) => {
        this.loading_get_details_edit_partenaire_projet_form = false;
      })
    }
  }
  