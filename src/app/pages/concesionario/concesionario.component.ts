import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Concesionario, IConcesionarios } from 'src/app/services/concesionarios/concesionario';
import { ConcesionariosService } from 'src/app/services/concesionarios/concesionarios.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-concesionario',
  templateUrl: './concesionario.component.html',
  styleUrls: ['./concesionario.component.css']
})
export class ConcesionarioComponent implements OnInit {

  concesionarios: IConcesionarios[];
  concesionario: IConcesionarios;
  loading: boolean;
  submitted = false;
  mForma: FormGroup;
  tipoForm: string;
  modalDetalle: boolean;
  modalIngresar: boolean;
  titleModal: string;
  modalRef: any;

  constructor(
    private serviceConcesionario: ConcesionariosService,
    private toast: ToastrService,
    private FormBuil: FormBuilder,
    private modalService: NgbModal
  ) {
    this.loading = false;
    this.concesionario = Concesionario.empty();
    this.concesionarios = [];
    this.mForma = this.generarFormulario();
    this.tipoForm = '';
    this.modalDetalle = false;
    this.modalIngresar = false;
    this.titleModal = '';

  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.loading = true;
    this.serviceConcesionario.getAll().then(data => {
      console.log(data)
      if (data.success == false) {
        this.showAlert(false, data.message);
        return;
      }
      this.concesionarios = data;
      console.log(this.concesionarios);
      this.loading = false;

    }).catch(error => {
      this.showAlert(false, error.message)
    });
  }
  ingresar(content: any) {
  
    this.mForma.reset();
    this.modalDetalle = false
    this.modalIngresar = true
    this.titleModal = 'Ingrese Concesionario';
    this.modalRef = this.modalService.open(content, { size: 'lg' });

  }
  ver(content: any, id: any) {

    this.modalDetalle = true
    this.titleModal = 'Detalle del concensionario';
    this.modalRef = this.modalService.open(content, { size: 'lg' });

    this.serviceConcesionario.getById(id).then(data => {
      this.concesionario = data[0];
      console.log(this.concesionario);

    }).catch(error => {
      this.showAlert(false, error.message);
    });
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
    this.serviceConcesionario.delete(id).then(data => {
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

  actualizarConcesionario(id: any) {
    this.serviceConcesionario.update(this.concesionario, id).then(data => {
      this.showAlert(data.success, data.message);

      if (data.success) {
        this.mForma.reset();
        this.getAll();
        this.modalRef.close();
      }

      console.log(data);
    }).catch(error => {
      this.showAlert(false, error.message)
    });
  }

  modificar(content : any,id: any) {
    this.tipoForm = 'actualizar'
    this.serviceConcesionario.getById(id).then(data => {
      this.concesionario = data[0];
      console.log(this.concesionario);
      this.ingresar(content);
      this.mForma.setValue({
        nombre: this.concesionario.nombre,
        razon: this.concesionario.razon,
        email: this.concesionario.email,
        telefono: this.concesionario.telefono,
        departamento: this.concesionario.departamento,
        municipio: this.concesionario.municipio,

      });
  
    }).catch(error => {
      this.showAlert(false, error.message);
    });
  }

  generarFormulario() {
    return this.FormBuil.group({
      nombre: ['',],
      razon: [''],
      email: [''],
      telefono: [''],
      departamento: [''],
      municipio: ['']
    });
  }

  insertarConcesionario() {
    this.serviceConcesionario.new(this.concesionario).then(data => {
      this.showAlert(data.success, data.message);

      if (data.success) {
        this.mForma.reset();
        this.concesionarios.push(this.concesionario);
        this.modalIngresar = false;
        this.getAll();
        this.modalRef.close();
      }

      console.log(data);
    }).catch(error => {
      this.showAlert(false, error.message)
    });
  }

  onSubmit() {
    let idTemp = this.concesionario.id;
    this.concesionario = this.mForma.value as IConcesionarios;
    console.log(this.concesionario);

    if (this.tipoForm == 'actualizar') {
      this.actualizarConcesionario(idTemp);
    } else {
      this.tipoForm = ''
      this.insertarConcesionario();
    }
    this.limpiarCampos();
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
