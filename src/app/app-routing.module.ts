import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthguardadmService } from './services/authguardadm.service';

const routes: Routes = [
  { path: '', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'adm', loadChildren: './adm/tabs/tabs.module#TabsPageModule',canActivate:[AuthguardadmService] },
  { path: 'cli', loadChildren: './cli/tabs/tabs.module#TabsPageModule', canActivate: [AuthGuardService] },
  
  
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

