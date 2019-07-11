import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:
      [
        {
          path: 'datos-personales',
          children:
            [
              {
                path: '',
                loadChildren: './../datos-personales/datos-personales.module#DatosPersonalesPageModule'

              }
            ]
        },
        {
          path: 'inicio',
          children: [
            {
              path: "",
              loadChildren: '../inicio/inicio.module#InicioPageModule'
            },
            {
              path: 'vercurso',
              children: [

                {
                  path: '',
                  loadChildren: '../vercurso/vercurso.module#VercursoPageModule'
                },
                {
                  path: 'detallepago',
                  loadChildren: '../detallepago/detallepago.module#DetallepagoPageModule'
                },
                {
                  path: 'verinstructor',
                  loadChildren: '../ver-instructor/ver-instructor.module#VerInstructorPageModule'
                },
                {
                  path: 'selecthorario',
                  loadChildren: '../selecthorario/selecthorario.module#SelecthorarioPageModule'
                },


              ]
            },
            {
              path: 'verinstructorI',
              children: [
                {
                  path: '',
                  loadChildren: '../ver-instructor/ver-instructor.module#VerInstructorPageModule'
                },
                {
                  path: 'vercursop',
                  loadChildren: '../vercurso/vercurso.module#VercursoPageModule'
                },

              ]
            },
            {
              path: '',
              redirectTo: '/cli/inicio',
              pathMatch: 'full'
            }
          ]
        },
        {
          path: 'mis-cursos',
          children: [
            {
              path: '',
              loadChildren: '../mycourses/mycourses.module#MycoursesPageModule'
            },
            {
              path: 'vermicurso',
              children: [
                {
                  path: '',
                  loadChildren: '../vermicurso/vermicurso.module#VermicursoPageModule'
                },
                {
                  path: 'verejercicio',
                  loadChildren: '../detalleejercicio/detalleejercicio.module#DetalleejercicioPageModule'
                },
              ]

            },

          ]
        },
        {
          path: 'miperfil',
          children: [
            {
              path: '',
              loadChildren: '../miperfil/miperfil.module#MiperfilPageModule'
            },
            {
              path: 'modmiperfil',
              loadChildren: '../modmiperfil/modmiperfil.module#ModmiperfilPageModule'
            },

          ]
        },
        {
          path: '',
          redirectTo: '/cli/inicio',
          pathMatch: 'full'
        }
      ]
  }]
@NgModule({
  imports:
    [
      RouterModule.forChild(routes)
    ],
  exports:
    [
      RouterModule
    ]
})
export class TabsPageRoutingModule { }