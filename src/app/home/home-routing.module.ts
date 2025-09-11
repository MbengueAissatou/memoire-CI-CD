import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAvenantProjetComponent } from './avenant-projet/list-avenant-projet/list-avenant-projet.component';
import { ListBailleurComponent } from './bailleur/list-bailleur/list-bailleur.component';
import { ListCelluleComponent } from './cellule/list-cellule/list-cellule.component';
import { ListCircuitApprobationDesFacturesComponent } from './circuit-approbation-des-factures/list-circuit-approbation-des-factures/list-circuit-approbation-des-factures.component';
import { ListCircuitFactureComponent } from './circuit-facture/list-circuit-facture/list-circuit-facture.component';
import { ListClientComponent } from './client/list-client/list-client.component';
import { ListEtatProjetComponent } from './etat-projet/list-etat-projet/list-etat-projet.component';
import { ListFactureComponent } from './facture/list-facture/list-facture.component';
import { ListFichierComponent } from './fichier/list-fichier/list-fichier.component';
import { ListPartenaireComponent } from './partenaire/list-partenaire/list-partenaire.component';
import { ListPartenaireProjetComponent } from './partenaire-projet/list-partenaire-projet/list-partenaire-projet.component';
import { ListPartiePrenanteComponent } from './partie-prenante/list-partie-prenante/list-partie-prenante.component';
import { ListPaysComponent } from './pays/list-pays/list-pays.component';
import { ListPrivilegeComponent } from './privilege/list-privilege/list-privilege.component';
import { ListProjetComponent } from './projet/list-projet/list-projet.component';
import { ListStatutFactureComponent } from './statut-facture/list-statut-facture/list-statut-facture.component';
import { ListUtilisateurComponent } from './utilisateur/list-utilisateur/list-utilisateur.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ProfilComponent } from './utilisateur/profil/profil.component';
import { DetailsProjetComponent } from './projet/details-projet/details-projet.component';
import { PourcentagePartenaireComponent } from './dashboard/pourcentage-partenaire/pourcentage-partenaire.component';
import { PourcentageMontantComponent } from './dashboard/pourcentage-montant/pourcentage-montant.component';
import { MontantRestantComponent } from './dashboard/montant-restant/montant-restant.component';
import { DetailsFactureComponent } from './facture/details-facture/details-facture.component';
import { NotificationComponent } from './notification/notification/notification.component';
import { CaMensuelComponent } from './dashboard/stats/ca-mensuel/ca-mensuel.component';
import { MontantComparerComponent } from './dashboard/stats/montant-comparer/montant-comparer.component';
import { CaParClientComponent } from './dashboard/stats/ca-par-client/ca-par-client.component';
import { CaParProjetComponent } from './dashboard/stats/ca-par-projet/ca-par-projet.component';

const routes: Routes = [
  { path: "", component: DashboardComponent },
  { path: "avenant_projet", component: ListAvenantProjetComponent },
  { path: "bailleur", component: ListBailleurComponent },
  { path: "cellule", component: ListCelluleComponent },
  { path: "circuit_approbation_des_factures", component: ListCircuitApprobationDesFacturesComponent },
  { path: "circuit_facture", component: ListCircuitFactureComponent },
  { path: "client", component: ListClientComponent },
  { path: "etat_projet", component: ListEtatProjetComponent },
  { path: "facture", component: ListFactureComponent },
  { path: "fichier", component: ListFichierComponent },
  { path: "partenaire", component: ListPartenaireComponent },
  { path: "partenaire_projet", component: ListPartenaireProjetComponent },
  { path: "partie_prenante", component: ListPartiePrenanteComponent },
  { path: "pays", component: ListPaysComponent },
  { path: "privilege", component: ListPrivilegeComponent },
  { path: "projet", component: ListProjetComponent },
  { path: "details_projet/:id", component: DetailsProjetComponent },
  { path: "details_projet_notif/:id_projet/:id_facture", component: DetailsProjetComponent },
  { path: "statut_facture", component: ListStatutFactureComponent },
  { path: "utilisateur", component: ListUtilisateurComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "profil", component: ProfilComponent },
  { path: "pourcentage_partenaire/:id", component: PourcentagePartenaireComponent },
  { path: "pourcentage_montant/:id", component: PourcentageMontantComponent },
  { path: "montant_restant/:id", component: MontantRestantComponent },
  { path: 'details/:id', component: DetailsFactureComponent },
  { path: 'notification', component: NotificationComponent },
  { path: 'ca_mensuel', component: CaMensuelComponent },
  { path: 'comparer', component: MontantComparerComponent },
  { path: 'ca_client', component: CaParClientComponent },
  { path: 'ca_projet', component: CaParProjetComponent },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
