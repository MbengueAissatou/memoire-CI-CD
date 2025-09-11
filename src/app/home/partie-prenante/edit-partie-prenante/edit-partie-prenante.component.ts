
  import { Component, EventEmitter, Input, Output } from '@angular/core';
  import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
  import { ApiService } from '../../../service/api/api.service';
  import { CommonModule } from '@angular/common';
  import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
  @Component({
    selector: 'app-edit-partie-prenante',
    standalone: true, // Composant autonome
    imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
    templateUrl: './edit-partie-prenante.component.html',
    styleUrls: ['./edit-partie-prenante.component.css']
  })
  export class EditPartiePrenanteComponent {
    reactiveForm_edit_partie_prenante !: FormGroup;
    submitted: boolean = false
    loading_edit_partie_prenante: boolean = false
    @Input()
    partie_prenante_to_edit: any = {}
    form_details: any = {}
    loading_get_details_edit_partie_prenante_form = false
    constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
        
    }
    ngOnInit(): void {
        this.get_details_edit_partie_prenante_form()
        this.update_form(this.partie_prenante_to_edit)
    }
    // mise à jour du formulaire
    update_form(partie_prenante_to_edit:any) {
        this.reactiveForm_edit_partie_prenante = this.formBuilder.group({
            nom : [partie_prenante_to_edit.nom, Validators.required],
prenom : [partie_prenante_to_edit.prenom],
fonction : [partie_prenante_to_edit.fonction],
telephone : [partie_prenante_to_edit.telephone],
email : [partie_prenante_to_edit.email],
updated_at : [partie_prenante_to_edit.updated_at, Validators.required]
        });
    }
  
    // acces facile au champs de votre formulaire
    get f(): any { return this.reactiveForm_edit_partie_prenante .controls; }
    // validation du formulaire
    onSubmit_edit_partie_prenante() {
        this.submitted = true;
        console.log(this.reactiveForm_edit_partie_prenante.value)
        // stop here if form is invalid
        if (this.reactiveForm_edit_partie_prenante.invalid) {
            return;
        }
        var partie_prenante = this.reactiveForm_edit_partie_prenante.value
        this.edit_partie_prenante({
        condition:JSON.stringify({id_partie_prenante:this.partie_prenante_to_edit.id_partie_prenante}),
        data:JSON.stringify(partie_prenante)
        })
    }
    // vider le formulaire
    onReset_edit_partie_prenante() {
        this.submitted = false;
        this.reactiveForm_edit_partie_prenante.reset();
    }
    edit_partie_prenante(partie_prenante: any) {
        this.loading_edit_partie_prenante = true;
        this.api.taf_post("partie_prenante/edit", partie_prenante, (reponse: any) => {
            if (reponse.status) {
                this.activeModal.close(reponse)
                console.log("Opération effectuée avec succés sur la table partie_prenante. Réponse= ", reponse);
                //this.onReset_edit_partie_prenante()
                this.api.Swal_success("Opération éffectuée avec succés")
            } else {
                console.log("L'opération sur la table partie_prenante a échoué. Réponse= ", reponse);
                this.api.Swal_error("L'opération a echoué")
            }
            this.loading_edit_partie_prenante = false;
        }, (error: any) => {
            this.loading_edit_partie_prenante = false;
        })
    }
    get_details_edit_partie_prenante_form() {
        this.loading_get_details_edit_partie_prenante_form = true;
        this.api.taf_post("partie_prenante/get_form_details", {}, (reponse: any) => {
          if (reponse.status) {
            this.form_details = reponse.data
            console.log("Opération effectuée avec succés sur la table partie_prenante. Réponse= ", reponse);
          } else {
            console.log("L'opération sur la table partie_prenante a échoué. Réponse= ", reponse);
            this.api.Swal_error("L'opération a echoué")
          }
          this.loading_get_details_edit_partie_prenante_form = false;
        }, (error: any) => {
        this.loading_get_details_edit_partie_prenante_form = false;
      })
    }
  }
  