export class PerfilEstudiante extends PerfilGeneral {
    constructor(nombre, nombre2, apellido1, apellido2, email, contrasena, rol, estado, carne) {
      constructor(nombre, nombre2, apellido1, apellido2, email, contrasena, rol, estado);
      this.carne = carne;
    }
  
    getCarne() {
      return this.carne;
    }
  
    setCarne(carne) {
      this.carne = carne;
    }
  }
  