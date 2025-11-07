import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Rol, RolService } from '../../services/rol-service';

@Component({
  selector: 'app-rol-component',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './rol-component.html',
  styleUrl: './rol-component.css',
})

export class RolComponent implements OnInit {
  
  constructor(
    private fb: FormBuilder,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      nivelAcceso: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      activo: [true]
    });

    this.cargarRoles();
  }

  // ==== Señales reactivas ====
  roles = signal<Rol[]>([]);
  cargandoLista = signal(false);
  guardando = signal(false);
  error = signal<string | null>(null);
  editandoId = signal<number | null>(null);

  form!: FormGroup;

  // ==== Cargar lista ====
  cargarRoles() {
    this.cargandoLista.set(true);
    this.error.set(null);

    this.rolService.listar().subscribe({
      next: (data) => {
        this.roles.set(data);
        this.cargandoLista.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar los roles.');
        this.cargandoLista.set(false);
      }
    });
  }

  // ==== Guardar o actualizar ====
  guardar() {
    if (this.form.invalid) return;
    this.guardando.set(true);

    const rol: Rol = this.form.value as Rol;

    if (this.editandoId()) {
      // Actualizar
      this.rolService.actualizar(this.editandoId()!, rol).subscribe({
        next: (actualizado) => {
          this.roles.update(list =>
            list.map(r => r.id === actualizado.id ? actualizado : r)
          );
          this.cancelarEdicion();
          this.guardando.set(false);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Error al actualizar el rol.');
          this.guardando.set(false);
        }
      });
    } else {
      // Crear
      this.rolService.crear(rol).subscribe({
        next: (nuevo) => {
          this.roles.update(list => [...list, nuevo]);
          this.form.reset({ activo: true, nivelAcceso: 1 });
          this.guardando.set(false);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Error al guardar el rol.');
          this.guardando.set(false);
        }
      });
    }
  }

  // ==== Editar ====
  editar(rol: Rol) {
    this.editandoId.set(rol.id!);
    this.form.setValue({
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      nivelAcceso: rol.nivelAcceso,
      activo: rol.activo
    });
  }

  // ==== Cancelar edición ====
  cancelarEdicion() {
    this.editandoId.set(null);
    this.form.reset({ activo: true, nivelAcceso: 1 });
  }

  // ==== Eliminar ====
  eliminar(rol: Rol) {
    if (!confirm(`¿Seguro que deseas eliminar el rol "${rol.nombre}"?`)) return;

    this.rolService.eliminar(rol.id!).subscribe({
      next: () => {
        this.roles.update(list => list.filter(r => r.id !== rol.id));
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al eliminar el rol.');
      }
    });
  }
}