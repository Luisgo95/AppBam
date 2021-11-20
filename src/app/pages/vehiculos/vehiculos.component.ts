import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IConcesionarios } from 'src/app/services/concesionarios/concesionario';
import { ConcesionariosService } from 'src/app/services/concesionarios/concesionarios.service';
import { IVehiculos, Vehiculos } from 'src/app/services/vehiculos/vehiculos';
import { VehiculosService } from 'src/app/services/vehiculos/vehiculos.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  vehiculos: IVehiculos[];
  vehiculo: IVehiculos;
  concesionarios: IConcesionarios[];
  loading: boolean;
  lineas: any[];
  colores: any[];
  marcas: any[];
  tipos: any[];
  submitted = false;
  mForma: FormGroup;
  tipoForm: string;
  modalDetalle: boolean;
  modalIngresar: boolean;
  titleModal: string;
  modalRef: any;

  constructor(
    private serviceVehiculo: VehiculosService,
    private toast: ToastrService,
    private FormBuil: FormBuilder,
    private serviceConcesionarios: ConcesionariosService,
    private modalService: NgbModal
  ) {
    this.vehiculos = [];
    this.vehiculo = Vehiculos.empty();
    this.loading = false;
    this.lineas = [];
    this.concesionarios = [];
    this.colores = []
    this.marcas = [];
    this.tipos = [];
    this.mForma = this.generarFormulario();
    this.tipoForm = '';
    this.modalDetalle = false;
    this.modalIngresar = false;
    this.titleModal = '';
  }

  ngOnInit(): void {
    this.getAll();
    this.getAllConcesionarios();
    this.getLineas();
    this.getColores();
    this.getMarcas();
    this.getTipos();
  }

  getAll() {
    this.loading = true;
    this.serviceVehiculo.getAll().then(data => {
      this.vehiculos = data;
      console.log(this.vehiculos);
      this.loading = false;
    }).catch(error => {
      this.showAlert(false, error.message)
    });
  }

  getAllConcesionarios() {
    this.loading = true;
    this.serviceConcesionarios.getAll().then(data => {
      this.concesionarios = data;
      console.log(this.concesionarios);
      this.loading = false;
    }).catch(error => {
      this.toast.error('Ocurrió un error al obtener los concesioanrios');
      this.loading = false;
    });
  }

  insertarVehiculo() {
    this.serviceVehiculo.new(this.vehiculo).then(data => {
      this.showAlert(data.success, data.message);

      if (data.success) {
        this.mForma.reset();
        this.vehiculos.push(this.vehiculo);
        this.modalIngresar = false;
      }

      console.log(data);
    }).catch(error => {
      this.showAlert(false, error.message)
    });
  }


  actualizarVehiculo(id: any) {
    this.serviceVehiculo.update(this.vehiculo, id).then(data => {
      this.showAlert(data.success, data.message);

      if (data.success) {
        this.mForma.reset();
        this.getAll();
      }

      console.log(data);
    }).catch(error => {
      this.showAlert(false, error.message)
    });
  }

  ver(content: any, id: any) {
    this.modalIngresar = false
    this.modalDetalle = true
    this.titleModal = 'Detalle de vehículo';
    this.modalRef = this.modalService.open(content, { size: 'lg' });

    this.serviceVehiculo.getById(id).then(data => {
      this.vehiculo = data[0];
      console.log(this.vehiculo);

    }).catch(error => {
      this.showAlert(false, error.message);
    });
  }
  ingresar(content: any) {
    this.mForma.reset();
    this.modalDetalle = false
    this.modalIngresar = true
    this.titleModal = 'Ingrese vehículo';
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }
  nuevo() {

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
    this.serviceVehiculo.delete(id).then(data => {
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

  limpiarCampos() {
    this.mForma.reset();
  }

  modificar(content: any,id: any) {
    this.tipoForm = 'actualizar'
    this.serviceVehiculo.getById(id).then(data => {
      this.vehiculo = data[0];
      console.log(this.vehiculo);
      this.ingresar(content);
      
      this.mForma.setValue({
        marca: this.vehiculo.marca,
        linea: this.vehiculo.linea,
        color: this.vehiculo.color,
        modelo: this.vehiculo.modelo,
        tipo: this.vehiculo.tipo,
        formaPago: this.vehiculo.formaPago,
        numeroPagos: this.vehiculo.numeroPagos,
        cc: this.vehiculo.cc,
        v: this.vehiculo.v,
        concesionarioId: this.vehiculo.concesionarioId,
        costo: this.vehiculo.costo,
        precio: this.vehiculo.precio,
        cantidad: this.vehiculo.cantidad

      });

    }).catch(error => {
      this.showAlert(false, error.message);
    });
  }

  getLineas() {
    this.lineas = [
      { nombre: 'Yaris' },
      { nombre: 'Protege 5' },
      { nombre: 'Corrolla' },
      { nombre: 'Mazda 6' },
      { nombre: 'Runner' },
      { nombre: 'Hilux' },
      { nombre: 'Civic' },
      { nombre: 'Chevrolet' },
      { nombre: 'Hatchback' },
      { nombre: 'Sedan' },
      { nombre: 'Aveo' },
      { nombre: 'frontier' },
      { nombre: 'Urban' }
    ]
  }

  getColores() {
    this.colores = [
      { nombre: 'Blanco' },
      { nombre: 'Rojo' },
      { nombre: 'Azul' },
      { nombre: 'Negro' },
      { nombre: 'Rojo' },
      { nombre: 'Celeste' },
      { nombre: 'Gris' },
      { nombre: 'Rosa' }
    ]
  }

  getMarcas() {
    this.marcas = [
      { nombre: 'Toyota' },
      { nombre: 'Mazda' },
      { nombre: 'Honda' },
      { nombre: 'KIA' },
      { nombre: 'Hyudai' },
      { nombre: 'Ford' }
    ]
  }

  getTipos() {
    this.tipos = [
      { nombre: 'Automóvil' },
      { nombre: 'Pickup' },
      { nombre: 'Microbus'},
      { nombre: '4X4' },
      { nombre: 'Camioneta'},
    ]
  }

  generarFormulario() {
    return this.FormBuil.group({
      marca: ['',],
      linea: [''],
      color: [''],
      modelo: [''],
      tipo: [''],
      formaPago: [''],
      numeroPagos: [''],
      cc: [''],
      v: [''],
      concesionarioId: [''],
      costo: [''],
      precio: [''],
      cantidad: ['']
    });
  }

  onSubmit() {
    let idTemp = this.vehiculo.id;
    this.vehiculo = this.mForma.value as IVehiculos;
    this.vehiculo.id = idTemp;
    console.log(this.vehiculo);

    if (this.tipoForm == 'actualizar') {
      this.actualizarVehiculo(idTemp);
    } else {
      this.insertarVehiculo();
    }
    this.limpiarCampos()

  }

  showAlert(success: boolean, message: string) {

    if (success) {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: true
      })
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: true
      })
    }
  }

}
