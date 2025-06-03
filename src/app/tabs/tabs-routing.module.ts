import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'explore', // Ruta para Tab 1: Explorar
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'visits', // Ruta para Tab 2: Visitas
        children: [
          {
            path: '',
            loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
          },
          /*{
            path: 'record-visit', // Ruta para la página de registro de visita
            loadChildren: () => import('../record-visit/record-visit.module').then(m => m.RecordVisitPageModule)
          },
          {
            path: 'tag-famous', // Ruta para la página de etiquetar famoso
            loadChildren: () => import('../tag-famous/tag-famous.module').then(m => m.TagFamousPageModule)
          }*/
        ]
      },
      {
        path: 'favorites', // Ruta para Tab 3: Favoritos
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'queries', // Ruta para Tab 4: Consultas
        loadChildren: () => import('../tab4/tab4.module').then(m => m.Tab4PageModule)
      },
      {
        path: 'profile', // Ruta para Tab 5: Información Personal
        loadChildren: () => import('../tab5/tab5.module').then(m => m.Tab5PageModule)
      },
      {
        path: '', // Ruta por defecto dentro de /tabs (redirige a la primera tab)
        redirectTo: 'explore', // Redirige a la nueva Tab 1: Explorar
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
