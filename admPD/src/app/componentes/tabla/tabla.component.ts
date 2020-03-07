import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Persona } from '../entidades/persona';
import { PersonaService } from 'src/app/servicio/persona.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators, FormGroup } from '@angular/forms';




@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  personas: Persona[] = [];
  personaObj: Persona;

  persona = new FormGroup({
    id: new FormControl(),
    nombre: new FormControl("", [Validators.required, Validators.minLength(2),Validators.pattern('^[a-zA-ZñÑ]+$')]),
    apellido: new FormControl("", [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-ZñÑ]+$')]),
    dni:new FormControl("", [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(7), Validators.maxLength(8)])
    
  });


  constructor(private servicio: PersonaService, private router: Router, private modalService: NgbModal,  private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getAll();
  }    

  getAll() {

    this.servicio.getAll().subscribe(data => {
      this.personas = data;
      console.log(this.personas);
    });
  }

  delete(id: number) {
    const opcion = confirm('¿Está seguro que deseas confirmar el evento?');
    if (opcion === true) {
      this.servicio.delete(id).subscribe(data => {
        console.log(data);
        alert('Registro Eliminado');
        location.reload();
      });
    }
  }

 

  agregar(editModal) {
    
    this.persona = new FormGroup({
      id: new FormControl(),
      nombre: new FormControl("", [Validators.required, Validators.minLength(2),Validators.pattern('^[a-zA-ZñÑ]+$')]),
      apellido: new FormControl("", [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-ZñÑ]+$')]),
      dni:new FormControl("", [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(7), Validators.maxLength(8)])
      
    });

    this.modalService.open(editModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  update(editModal, i) {
    this.persona.get('id').setValue(i.id);
    this.persona.get('nombre').setValue(i.nombre);
    this.persona.get('apellido').setValue(i.apellido);
    this.persona.get('dni').setValue(i.dni);
    

    this.modalService.open(editModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  confirmarEdit(personaForm: FormGroup) {
    if (personaForm.get('id').value) {

      this.personaObj = personaForm.value;
      this.servicio.put(this.personaObj.id, this.personaObj).subscribe(data => {
        this.personaObj = data;
        
       
        this.personas.find(a => a.id == this.personaObj.id).nombre = this.personaObj.nombre;  
        this.personas.find(a => a.id == this.personaObj.id).apellido = this.personaObj.apellido;  
        this.personas.find(a => a.id == this.personaObj.id).dni = this.personaObj.dni;  
        this.personas.find(a => a.id == this.personaObj.id).id = this.personaObj.id;  
        
        this.cdr.detectChanges();
        this.modalService.dismissAll();
      });
    } else {
      this.personaObj = personaForm.value;
      this.servicio.post(this.personaObj).subscribe(data => {
        this.personaObj = data;
        this.personas.push(this.personaObj);
        this.modalService.dismissAll();
      });

    }

  }
}
