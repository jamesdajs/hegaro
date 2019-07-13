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
          path: 'cursos',
          children:
            [
              {
                path: '',
                loadChildren: '../miscursos/miscursos.module#MiscursosPageModule'
              },
              {
                path: 'crearcurso',
                children:[
                  {
                    path: '',
                    loadChildren: '../crearcurso/crearcurso.module#CrearcursoPageModule'
                  },
                  {
                    path: 'crearhorario',
                    loadChildren: '../mishorarios/mishorarios.module#MishorariosPageModule'
                  }

                ]
              },
                { 
                  path: 'cursomodificar', 
                  loadChildren: '../cursomodificar/cursomodificar.module#CursomodificarPageModule' 
                },
                { 
                  path: 'cursosinactivos', 
                  loadChildren: '../cursosinactivos/cursosinactivos.module#CursosinactivosPageModule' 
                }
            ]
        },
        {
          path: 'misalumnos',
          children:
            [
              {
                path: '',
                loadChildren: '../alumnos/alumnos.module#AlumnosPageModule'
              },
              {
                path: 'alumnodetalle',
                children: [
                  {
                    path: '',
                    loadChildren: '../alumnosdetalle/alumnosdetalle.module#AlumnosdetallePageModule'
                  },
                  {
                    path:'creardef',
                    loadChildren: '../rutinas/crear/crear.module#CrearPageModule'
                  },
                  {
                    path: 'modificardef',
                    loadChildren: '../rutinas/modificar/modificar.module#ModificarPageModule'
                  },
                  {
                    path: 'detalleejer',
                    loadChildren: '../ejercicios/detalle/detalle.module#DetallePageModule'
                  }

                  
                ]
              },
            ]
        },
        {
          path: 'perfil',
          children:
            [
              {
                path: '',
                loadChildren: '../perfil/perfil.module#PerfilPageModule'

              },

              {
                path: 'mod-perfil',
                loadChildren: '../mod-perfil/mod-perfil.module#ModPerfilPageModule'
              },
              {
                path: 'mishorarios',
                loadChildren: '../mishorarios/mishorarios.module#MishorariosPageModule'
              },

            ]
        },
        {
          path: 'tipo-ejercicios',
          children:
            [
              {
                path: '',
                loadChildren: '../tipo-ejercicios/tipo-ejercicios.module#TipoEjerciciosPageModule'
              },
              {
                path: 'crear',
                loadChildren: '../crear-tipoejercicio/crear-tipoejercicio.module#CrearTipoejercicioPageModule'
              },

              {
                path: 'ejercicios',
                children: [
                  {
                    path: '',
                    loadChildren: '../ejercicios/ejercicios/ejercicios.module#EjerciciosPageModule'
                  },

                  {
                    path: 'crear',
                    loadChildren: '../ejercicios/crear/crear.module#CrearPageModule'
                  },
                  {
                    path: 'modificar',
                    loadChildren: '../ejercicios/modificar/modificar.module#ModificarPageModule'
                  },
                  {
                    path: 'detalle',
                    loadChildren: '../ejercicios/detalle/detalle.module#DetallePageModule'
                  },


                ]
              },

            ]
        },
        {
          path: 'rutinas',
          children: [
            {
              path: '',
              loadChildren: '../rutinas/listar/lista.module#ListaPageModule'
            },
            {
              path: 'crear',
              loadChildren: '../rutinas/crear/crear.module#CrearPageModule'
            },
            {
              path: 'modificar',
              loadChildren: '../rutinas/modificar/modificar.module#ModificarPageModule'
            },
            {
              path: 'detalle',
              loadChildren: '../ejercicios/detalle/detalle.module#DetallePageModule'
            },

          ]
        },
        {
          path: '',
          redirectTo: '/adm/cursos',
          pathMatch: 'full'
        }
      ]
  },
  {
    path: '',
    redirectTo: '/adm/cursos',
    pathMatch: 'full'
  }
];

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