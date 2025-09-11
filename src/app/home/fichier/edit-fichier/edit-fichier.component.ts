
  import { Component, EventEmitter, Input, Output } from '@angular/core';
  import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
  import { ApiService } from '../../../service/api/api.service';
  import { CommonModule } from '@angular/common';
  import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
  @Component({
    selector: 'app-edit-fichier',
    standalone: true, // Composant autonome
    imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
    templateUrl: './edit-fichier.component.html',
    styleUrls: ['./edit-fichier.component.css']
  })
  export class EditFichierComponent {
    reactiveForm_edit_fichier !: FormGroup;
    submitted: boolean = false
    loading_edit_fichier: boolean = false
    @Input()
    fichier_to_edit: any = {}
    form_details: any = {}
    loading_get_details_edit_fichier_form = false
    constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
        
    }
    ngOnInit(): void {
        this.get_details_edit_fichier_form()
        this.update_form(this.fichier_to_edit)
    }
    // mise à jour du formulaire
    update_form(fichier_to_edit:any) {
        this.reactiveForm_edit_fichier = this.formBuilder.group({
            id_projet : [fichier_to_edit.id_projet, Validators.required],
piece_jointe : [fichier_to_edit.piece_jointe],
updated_at : [fichier_to_edit.updated_at, Validators.required]
        });
    }
  
    // acces facile au champs de votre formulaire
    get f(): any { return this.reactiveForm_edit_fichier .controls; }
    // validation du formulaire
    onSubmit_edit_fichier() {
        this.submitted = true;
        console.log(this.reactiveForm_edit_fichier.value)
        // stop here if form is invalid
        if (this.reactiveForm_edit_fichier.invalid) {
            return;
        }
        var fichier = this.reactiveForm_edit_fichier.value
        this.edit_fichier({
        condition:JSON.stringify({id_fichier:this.fichier_to_edit.id_fichier}),
        data:JSON.stringify(fichier)
        })
    }
    // vider le formulaire
    onReset_edit_fichier() {
        this.submitted = false;
        this.reactiveForm_edit_fichier.reset();
    }
    edit_fichier(fichier: any) {
        this.loading_edit_fichier = true;
        this.api.taf_post("fichier/edit", fichier, (reponse: any) => {
            if (reponse.status) {
                this.activeModal.close(reponse)
                console.log("Opération effectuée avec succés sur la table fichier. Réponse= ", reponse);
                //this.onReset_edit_fichier()
                this.api.Swal_success("Opération éffectuée avec succés")
            } else {
                console.log("L'opération sur la table fichier a échoué. Réponse= ", reponse);
                this.api.Swal_error("L'opération a echoué")
            }
            this.loading_edit_fichier = false;
        }, (error: any) => {
            this.loading_edit_fichier = false;
        })
    }
    get_details_edit_fichier_form() {
        this.loading_get_details_edit_fichier_form = true;
        this.api.taf_post("fichier/get_form_details", {}, (reponse: any) => {
          if (reponse.status) {
            this.form_details = reponse.data
            console.log("Opération effectuée avec succés sur la table fichier. Réponse= ", reponse);
          } else {
            console.log("L'opération sur la table fichier a échoué. Réponse= ", reponse);
            this.api.Swal_error("L'opération a echoué")
          }
          this.loading_get_details_edit_fichier_form = false;
        }, (error: any) => {
        this.loading_get_details_edit_fichier_form = false;
      })
    }
  }
  