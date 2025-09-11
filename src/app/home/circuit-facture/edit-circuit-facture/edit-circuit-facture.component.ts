
  import { Component, EventEmitter, Input, Output } from '@angular/core';
  import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
  import { ApiService } from '../../../service/api/api.service';
  import { CommonModule } from '@angular/common';
  import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
  @Component({
    selector: 'app-edit-circuit-facture',
    standalone: true, // Composant autonome
    imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
    templateUrl: './edit-circuit-facture.component.html',
    styleUrls: ['./edit-circuit-facture.component.css']
  })
  export class EditCircuitFactureComponent {
    reactiveForm_edit_circuit_facture !: FormGroup;
    submitted: boolean = false
    loading_edit_circuit_facture: boolean = false
    @Input()
    circuit_facture_to_edit: any = {}
    form_details: any = {}
    loading_get_details_edit_circuit_facture_form = false
    constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
        
    }
    ngOnInit(): void {
        this.get_details_edit_circuit_facture_form()
        this.update_form(this.circuit_facture_to_edit)
    }
    // mise à jour du formulaire
    update_form(circuit_facture_to_edit:any) {
        this.reactiveForm_edit_circuit_facture = this.formBuilder.group({
            id_facture : [circuit_facture_to_edit.id_facture, Validators.required],
date : [circuit_facture_to_edit.date],
updated_at : [circuit_facture_to_edit.updated_at, Validators.required]
        });
    }
  
    // acces facile au champs de votre formulaire
    get f(): any { return this.reactiveForm_edit_circuit_facture .controls; }
    // validation du formulaire
    onSubmit_edit_circuit_facture() {
        this.submitted = true;
        console.log(this.reactiveForm_edit_circuit_facture.value)
        // stop here if form is invalid
        if (this.reactiveForm_edit_circuit_facture.invalid) {
            return;
        }
        var circuit_facture = this.reactiveForm_edit_circuit_facture.value
        this.edit_circuit_facture({
        condition:JSON.stringify({id_circuit_facture:this.circuit_facture_to_edit.id_circuit_facture}),
        data:JSON.stringify(circuit_facture)
        })
    }
    // vider le formulaire
    onReset_edit_circuit_facture() {
        this.submitted = false;
        this.reactiveForm_edit_circuit_facture.reset();
    }
    edit_circuit_facture(circuit_facture: any) {
        this.loading_edit_circuit_facture = true;
        this.api.taf_post("circuit_facture/edit", circuit_facture, (reponse: any) => {
            if (reponse.status) {
                this.activeModal.close(reponse)
                console.log("Opération effectuée avec succés sur la table circuit_facture. Réponse= ", reponse);
                //this.onReset_edit_circuit_facture()
                this.api.Swal_success("Opération éffectuée avec succés")
            } else {
                console.log("L'opération sur la table circuit_facture a échoué. Réponse= ", reponse);
                this.api.Swal_error("L'opération a echoué")
            }
            this.loading_edit_circuit_facture = false;
        }, (error: any) => {
            this.loading_edit_circuit_facture = false;
        })
    }
    get_details_edit_circuit_facture_form() {
        this.loading_get_details_edit_circuit_facture_form = true;
        this.api.taf_post("circuit_facture/get_form_details", {}, (reponse: any) => {
          if (reponse.status) {
            this.form_details = reponse.data
            console.log("Opération effectuée avec succés sur la table circuit_facture. Réponse= ", reponse);
          } else {
            console.log("L'opération sur la table circuit_facture a échoué. Réponse= ", reponse);
            this.api.Swal_error("L'opération a echoué")
          }
          this.loading_get_details_edit_circuit_facture_form = false;
        }, (error: any) => {
        this.loading_get_details_edit_circuit_facture_form = false;
      })
    }
  }
  