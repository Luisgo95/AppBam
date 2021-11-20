import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Agente, IAgentes } from 'src/app/services/agentes/agentes';
import { AgentesService } from 'src/app/services/agentes/agentes.service';
import { IConcesionarios } from 'src/app/services/concesionarios/concesionario';
import { ConcesionariosService } from 'src/app/services/concesionarios/concesionarios.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-agentes',
  templateUrl: './agentes.component.html',
  styleUrls: ['./agentes.component.css']
})
export class AgentesComponent implements OnInit {
 
  agentes: IAgentes[];
  agente: IAgentes;
  concesionarios: IConcesionarios[];
  loading: boolean;
  submitted = false;
  mForma: FormGroup;
  tipoForm: string;
  modalDetalle: boolean;
  titleModal: string;
  modalRef: any;
  modalIngresar = false;

  constructor(
    private serviceAgente: AgentesService,
    private serviceConcesionarios: ConcesionariosService,
    private toast: ToastrService,
    private FormBuil: FormBuilder,
    private modalService: NgbModal
  ) {
    this.loading = false;
    this.agente = Agente.empty();
    this.agentes = [];
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
    this.serviceAgente.getAll().then(data => {
      this.agentes = data;
      console.log(this.agentes);
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
      this.showAlert(false, error.message)
    });
  }

  ver(content: any, id: any) {

    this.modalDetalle = true
    this.titleModal = 'Detalle de agente';
    this.modalRef = this.modalService.open(content, { size: 'lg' });

    this.serviceAgente.getById(id).then(data => {
      this.agente = data[0];
      console.log(this.agente);

    }).catch(error => {
      this.showAlert(false, error.message);
    });
  }
  ingresar(content: any) {
    this.mForma.reset();
    this.modalDetalle = false
    this.modalIngresar = true
    this.titleModal = 'Ingrese agente';
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  eliminar(id: any) {
    console.log(id);
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
    this.serviceAgente.delete(id).then(data => {
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

  actualizarAgente(id: any) {
    this.serviceAgente.update(this.agente, id).then(data => {
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

  modificar(content : any,id: any) {
    this.tipoForm = 'actualizar'
    this.serviceAgente.getById(id).then(data => {
      this.agente = data[0];
      console.log(this.agente);
      this.ingresar(content);
      this.mForma.setValue({
        nombres: this.agente.nombres,
        apellidos: this.agente.apellidos,
        direccion: this.agente.direccion,
        telefono: this.agente.telefono,
        nacimiento: this.agente.nacimiento,
        concesionarioId: this.agente.concesionarioId,

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
      nacimiento: [''],
      concesionarioId: ['']
    });
  }

  insertarAgente() {
    this.serviceAgente.new(this.agente).then(data => {
      console.log(data);
      this.showAlert(data.success, data.message);

      if (data.success) {
        this.mForma.reset();
        this.agentes.push(this.agente);
        this.modalIngresar = false;
      }

    }).catch(error => {
      console.log(error);
      this.showAlert(false, error.message)
    });
  }

  onSubmit() {
    let idTemp = this.agente.id;
    this.agente = this.mForma.value as IAgentes;

    if (this.tipoForm == 'actualizar') {
      this.actualizarAgente(idTemp);
    } else {
      this.tipoForm = ''
      this.insertarAgente();
    }
  }

  limpiarCampos() {
    this.mForma.reset();
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
