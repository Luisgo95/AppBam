import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Cliente, IClientes } from 'src/app/services/clientes/clientes';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { IConcesionarios } from 'src/app/services/concesionarios/concesionario';
import { ConcesionariosService } from 'src/app/services/concesionarios/concesionarios.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: IClientes[];
  cliente: IClientes;
  concesionarios: IConcesionarios[];
  loading: boolean;
  submitted = false;
  mForma: FormGroup;
  tipoForm: string;
  modalDetalle: boolean;
  modalIngresar: boolean;
  titleModal: string;
  modalRef: any;

  constructor(
    private serviceClientes: ClientesService,
    private toast: ToastrService,
    private FormBuil: FormBuilder,
    private serviceConcesionarios: ConcesionariosService,
    private modalService: NgbModal
  ) {
    this.loading = false;
    this.cliente = Cliente.empty();
    this.clientes = [];
    this.concesionarios = [];
    this.mForma = this.generarFormulario();
    this.tipoForm = '';
    this.modalDetalle = false;
    this.modalIngresar = false;
    this.titleModal = '';
  }

  ngOnInit(): void {
    this.getAll();
    this.getAllConcesionarios();
  }

  getAll() {
    this.loading = true;
    this.serviceClientes.getAll().then(data => {
      this.clientes = data;
      console.log(this.clientes);
      this.loading = false;
    }).catch(error => {
      this.toast.error('Ocurrió un error al obtener los clientes');
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
      this.toast.error('Ocurrió un error al obtener los concesionarios');
      this.loading = false;
    });
  }


  ver(content: any, id: any) {
    this.modalIngresar = false
    this.modalDetalle = true
    this.titleModal = 'Detalle de cliente';
    this.modalRef = this.modalService.open(content, { size: 'lg' });

    this.serviceClientes.getById(id).then(data => {
      this.cliente = data[0];
      console.log(this.cliente);

    }).catch(error => {
      this.showAlert(false, error.message);
    });
  }
  ingresar(content: any) {
    this.mForma.reset();
    this.modalDetalle = false
    this.modalIngresar = true
    this.titleModal = 'Ingrese Cliente';
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
    this.serviceClientes.delete(id).then(data => {
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

  actualizarCliente(id: any) {
    this.serviceClientes.update(this.cliente, id).then(data => {
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

  modificar(content: any,id: any) {
    this.tipoForm = 'actualizar'
    this.serviceClientes.getById(id).then(data => {
      this.cliente = data[0];
      console.log(this.cliente);
      this.ingresar(content);
      this.mForma.setValue({
        nombres: this.cliente.nombres,
        apellidos: this.cliente.apellidos,
        direccion: this.cliente.direccion,
        telefono: this.cliente.telefono,
        email: this.cliente.email,
        nivelAcademico: this.cliente.nivelAcademico,
        profesion: this.cliente.profesion,
        concesionarioId: this.cliente.concesionarioId,

      });

    }).catch(error => {
      this.showAlert(false, error.message);
    });
  }

  generarFormulario() {
    return this.FormBuil.group({
      nombres: ['',],
      apellidos: [''],
      direccion: [''],
      telefono: [''],
      email: [''],
      nivelAcademico: [''],
      profesion: [''],
      concesionarioId: ['']
    });
  }

  insertarCliente() {
    this.serviceClientes.new(this.cliente).then(data => {
      this.showAlert(data.success, data.message);

      if (data.success) {
        this.mForma.reset();
        this.clientes.push(this.cliente);
        this.modalIngresar = false;
      }

      console.log(data);
    }).catch(error => {
      this.showAlert(false, error.message)
    });
  }

  onSubmit() {
    let idTemp = this.cliente.id;
    this.cliente = this.mForma.value as IClientes;
    console.log(this.cliente);

    if (this.tipoForm == 'actualizar') {
      this.actualizarCliente(idTemp);
    } else {
      this.tipoForm = ''
      this.insertarCliente();
    }
  }

  limpiarCampos() {
    this.mForma.reset();
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

}
