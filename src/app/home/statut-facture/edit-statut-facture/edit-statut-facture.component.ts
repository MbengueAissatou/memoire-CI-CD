
  import { Component, EventEmitter, Input, Output } from '@angular/core';
  import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
  import { ApiService } from '../../../service/api/api.service';
  import { CommonModule } from '@angular/common';
  import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
  @Component({
    selector: 'app-edit-statut-facture',
    standalone: true, // Composant autonome
    imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
    templateUrl: './edit-statut-facture.component.html',
    styleUrls: ['./edit-statut-facture.component.css']
  })
  export class EditStatutFactureComponent {
    reactiveForm_edit_statut_facture !: FormGroup;
    submitted: boolean = false
    loading_edit_statut_facture: boolean = false
    @Input()
    statut_facture_to_edit: any = {}
    form_details: any = {}
    loading_get_details_edit_statut_facture_form = false
    constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
        
    }
    ngOnInit(): void {
        this.get_details_edit_statut_facture_form()
        this.update_form(this.statut_facture_to_edit)
    }
    // mise à jour du formulaire
    update_form(statut_facture_to_edit:any) {
        this.reactiveForm_edit_statut_facture = this.formBuilder.group({
            nom : [statut_facture_to_edit.nom, Validators.required],
description : [statut_facture_to_edit.description],
updated_at : [statut_facture_to_edit.updated_at, Validators.required]
        });
    }
  
    // acces facile au champs de votre formulaire
    get f(): any { return this.reactiveForm_edit_statut_facture .controls; }
    // validation du formulaire
    onSubmit_edit_statut_facture() {
        this.submitted = true;
        console.log(this.reactiveForm_edit_statut_facture.value)
        // stop here if form is invalid
        if (this.reactiveForm_edit_statut_facture.invalid) {
            return;
        }
        var statut_facture = this.reactiveForm_edit_statut_facture.value
        this.edit_statut_facture({
        condition:JSON.stringify({id_statut_facture:this.statut_facture_to_edit.id_statut_facture}),
        data:JSON.stringify(statut_facture)
        })
    }
    // vider le formulaire
    onReset_edit_statut_facture() {
        this.submitted = false;
        this.reactiveForm_edit_statut_facture.reset();
    }
    edit_statut_facture(statut_facture: any) {
        this.loading_edit_statut_facture = true;
        this.api.taf_post("statut_facture/edit", statut_facture, (reponse: any) => {
            if (reponse.status) {
                this.activeModal.close(reponse)
                console.log("Opération effectuée avec succés sur la table statut_facture. Réponse= ", reponse);
                //this.onReset_edit_statut_facture()
                this.api.Swal_success("Opération éffectuée avec succés")
            } else {
                console.log("L'opération sur la table statut_facture a échoué. Réponse= ", reponse);
                this.api.Swal_error("L'opération a echoué")
            }
            this.loading_edit_statut_facture = false;
        }, (error: any) => {
            this.loading_edit_statut_facture = false;
        })
    }
    get_details_edit_statut_facture_form() {
        this.loading_get_details_edit_statut_facture_form = true;
        this.api.taf_post("statut_facture/get_form_details", {}, (reponse: any) => {
          if (reponse.status) {
            this.form_details = reponse.data
            console.log("Opération effectuée avec succés sur la table statut_facture. Réponse= ", reponse);
          } else {
            console.log("L'opération sur la table statut_facture a échoué. Réponse= ", reponse);
            this.api.Swal_error("L'opération a echoué")
          }
          this.loading_get_details_edit_statut_facture_form = false;
        }, (error: any) => {
        this.loading_get_details_edit_statut_facture_form = false;
      })
    }
  }
  