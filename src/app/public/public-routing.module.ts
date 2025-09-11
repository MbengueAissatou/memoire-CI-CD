import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListLoginComponent } from './login/list-login/list-login.component';
import { DeconnexionComponent } from './deconnexion/deconnexion.component';

const routes: Routes = [
  {path:"",component:ListLoginComponent},
{path:"login",component:ListLoginComponent},
{path:"deconnexion",component:DeconnexionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
