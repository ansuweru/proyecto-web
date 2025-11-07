import { Injectable } from '@angular/core';

export interface Rol{
  id: number;
  nombre: string;
  descripcion : string;
}
@Injectable({
  providedIn: 'root'
})

export class RolService {
  
}
