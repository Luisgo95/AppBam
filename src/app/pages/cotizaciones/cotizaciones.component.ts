import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IAgentes } from 'src/app/services/agentes/agentes';
import { AgentesService } from 'src/app/services/agentes/agentes.service';
import { IClientes } from 'src/app/services/clientes/clientes';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { IConcesionarios } from 'src/app/services/concesionarios/concesionario';
import { ConcesionariosService } from 'src/app/services/concesionarios/concesionarios.service';
import { Cotizacion, ICotizacion, ICotizaciones } from 'src/app/services/cotizaciones/cotizaciones';
import { CotizacionesService } from 'src/app/services/cotizaciones/cotizaciones.service';
import { IVehiculos, Vehiculos } from 'src/app/services/vehiculos/vehiculos';
import { VehiculosService } from 'src/app/services/vehiculos/vehiculos.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css']
})
export class CotizacionesComponent implements OnInit {

  cotizaciones: ICotizaciones[];
  cotizacion: ICotizacion
  cotizacionId: any;
  vehiculos: IVehiculos[];
  vehiculo: IVehiculos;
  clientes: IClientes[];
  concesionarios: IConcesionarios[];
  agentes: IAgentes[];
  loading: boolean;
  submitted = false;
  mForma: FormGroup;
  today: any;
  titleModal: string;
  modalCotizar: boolean;
  modalCotizarDetalle: boolean;
  modalRef: any;
  totalCotizacion: number;
  search: string;

  constructor(
    private serviceCotizacion: CotizacionesService,
    private serviceVehiculo: VehiculosService,
    private toast: ToastrService,
    private FormBuil: FormBuilder,
    private modalService: NgbModal,
    private serviceClientes: ClientesService,
    private serviceConcesionarios: ConcesionariosService,
    private serviceAgente: AgentesService
  ) {
    this.loading = false;
    this.cotizacion = Cotizacion.empty();
    this.cotizaciones = [];
    this.vehiculos = [];
    this.mForma = this.generarFormulario();
    this.today = Date.now();
    this.titleModal = 'title';
    this.modalCotizar = false;
    this.modalCotizarDetalle = false;
    this.vehiculo = Vehiculos.empty();
    this.clientes = [];
    this.concesionarios = []
    this.agentes = [];
    this.mForma = this.generarFormulario();
    this.totalCotizacion = 0;
    this.search = '';
    this.cotizacionId = {};
  }

  ngOnInit(): void {
    this.getAll();
    this.getAllVehiculos();
    this.getAllClientes();
    this.getAllConcesionarios();
    this.getAllAgentes();
  }

  getAll() {
    this.loading = true;
    this.serviceCotizacion.getAll().then(data => {
      this.cotizaciones = data;
      console.log(this.cotizaciones);
      this.loading = false;
    }).catch(error => {
      this.toast.error('Ocurrió un error al obtener los agentes');
      this.loading = false;
    });
  }

  getAllVehiculos() {
    this.loading = true;
    this.serviceVehiculo.getAll().then(data => {
      this.vehiculos = data;
      console.log(this.vehiculos);
      this.loading = false;
    }).catch(error => {
      this.showAlert(false, error.message)
    });
  }

  getAllClientes() {
    this.loading = true;
    this.serviceClientes.getAll().then(data => {
      this.clientes = data;
      console.log(this.clientes);
      this.loading = false;
    }).catch(error => {
      this.showAlert(false, error.message);
      this.loading = false;
    });
  }

  getAllConcesionarios() {
    this.loading = true;
    this.serviceConcesionarios.getAll().then(data => {
      this.concesionarios = data;
      console.log(this.concesionarios);
      this.loading = false;
    }).catch(error => {
      this.showAlert(false, error.message);
      this.loading = false;
    });
  }

  getAllAgentes() {
    this.loading = true;
    this.serviceAgente.getAll().then(data => {
      this.agentes = data;
      console.log(this.agentes);
      this.loading = false;
    }).catch(error => {
      this.showAlert(false, error.message)
    });
  }

  ver(content: any, vehiculo: any) {

    this.vehiculo = vehiculo;
    this.modalCotizarDetalle = false
    this.modalCotizar = true;
    this.titleModal = 'Cotizar vehículos';
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  nuevo() {

  }

  verCotizacion(content: any, id: any) {

    this.modalCotizar = false;
    this.modalCotizarDetalle = true
    this.titleModal = 'Detalle de cotización';
    this.modalRef = this.modalService.open(content, { size: 'lg' });

    this.getCotizacionById(id);
  }

  getCotizacionById(id: number) {
    this.serviceCotizacion.getId(id).then(data => {

      this.cotizacionId = data[0];
      console.log(this.cotizacionId);
    }).catch(error => {
      this.showAlert(false, error.message);
    })
  }

  searchCotizacion() {
    console.log(this.search);
    this.serviceCotizacion.search(this.search).then(data => {
      console.log(data);
      if (!data.success) {
        this.showAlert(data.success, data.message);
        return;
      }

      this.cotizaciones = data;

    }).catch(error => {
      this.showAlert(false, error.message);
    });
  }

  eliminar(id: any) {
    Swal.fire({
      title: '¿Eliminar?',
      text: "¿Está seguro de eliminar esta cotización?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro.'
    }).then((result) => {
      if (result.isConfirmed) {
        this.onDelete(id);
      }
    })
  }

  onDelete(id: number) {
    this.serviceCotizacion.delete(id).then(data => {
      if (data.success) {
        this.showAlert(data.success, data.message);
        this.getAll();
      } else {
        this.showAlert(data.success, data.message);
      }
    }).catch(error => {
      this.showAlert(false, error.message);
    })
  }

  modificar(id: any) {

  }


  generarFormulario() {
    return this.FormBuil.group({
      cantidad: [0],
      cliente_id: [0],
      concesionario_id: [0],
      agente_id: [0]
    });
  }

  insertarCotizacion() {
    this.serviceCotizacion.new(this.cotizacion).then(data => {
      this.showAlert(data.success, data.message);
      if (data.success) {
        this.mForma.reset();
        this.getAll();
        this.modalRef.close();
      }

      console.log(data);
    }).catch(error => {
      this.showAlert(false, error.message);
    });
  }

  onSubmit() {
    this.cotizacion = this.mForma.value as ICotizacion;
    this.cotizacion.vehiculo_id = this.vehiculo.id;
    this.cotizacion.total = this.vehiculo.precio * this.cotizacion.cantidad;

    console.log(this.cotizacion.total);
    this.cotizacion.createdAt = new Date(Date.now());

    this.insertarCotizacion();
  }

  showAlert(success: boolean, message: string) {

    if (success) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: message,
        showConfirmButton: true
      })
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: message,
        showConfirmButton: true
      })
    }
  }

  imprimirCotizacion() {
    Swal.fire({
      icon: 'error',
      title: 'Lo sentimos...',
      text: 'Aún no hemos habilitado esta opción',
      footer: '<p><b>Por favor intenta mas tarde</b> </p>'
    })
  }

  calcularTotal(event: any) {
    const cantidad = event.target.value;
    this.totalCotizacion = (cantidad * this.vehiculo.precio);

  }

}
