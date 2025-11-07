import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Rol, RolService } from '../../services/rol-service';

@Component({
  selector: 'app-rol-component',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './rol-component.html',
  styleUrl: './rol-component.css',
})
export class RolComponent{
  roles = signal<Rol[]>([]);
    cargandoLista = signal(true);
    guardando = signal(false);
    error = signal<string | undefined>(undefined);
    editandoId = signal<number | null>(null);
  
    form!: FormGroup;
}