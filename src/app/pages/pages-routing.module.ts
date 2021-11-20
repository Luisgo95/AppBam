import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentesComponent } from './agentes/agentes.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ConcesionarioComponent } from './concesionario/concesionario.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { HomeComponent } from './home/home.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import {ReportesComponent} from './reportes/reportes.component';
const routes: Routes = [{
  path: '', component: HomeComponent,
  children: [
    {
      path: 'cotizaciones', component: CotizacionesComponent
    },
    {
      path: 'vehiculos', component: VehiculosComponent
    },
    {
      path: 'clientes', component: ClientesComponent
    },
    {
      path: 'agentes', component: AgentesComponent
    },
    {
      path: 'concesionarios', component: ConcesionarioComponent
    } , {
      path: 'reportes', component: ReportesComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
