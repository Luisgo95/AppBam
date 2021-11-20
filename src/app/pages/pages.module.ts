import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { ClientesComponent } from './clientes/clientes.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { AgentesComponent } from './agentes/agentes.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { ConcesionarioComponent } from './concesionario/concesionario.component';
import { ReportesComponent } from './reportes/reportes.component';

@NgModule({
  declarations: [
    ClientesComponent,
    VehiculosComponent,
    HomeComponent,
    AgentesComponent,
    CotizacionesComponent,
    ConcesionarioComponent,
    ReportesComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [

  ],

})
export class PagesModule { }
