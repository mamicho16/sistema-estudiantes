class PerfilGeneral {
    constructor(nombreUsuario, contrasena, rol, estado) {
      this.nombreUsuario = nombreUsuario;
      this.contrasena = contrasena;
      this.rol = rol;
      this.estado = estado;
    }
    
    getNombreUsuario() {
      return this.nombreUsuario;
    }
  
    setNombreUsuario(nombreUsuario) {
      this.nombreUsuario = nombreUsuario;
    }
  
    getContrasena() {
      return this.contrasena;
    }
  
    setContrasena(contrasena) {
      this.contrasena = contrasena;
    }
  
    getRol() {
      return this.rol;
    }
  
    setRol(rol) {
      this.rol = rol;
    }
  
    getEstado() {
      return this.estado;
    }
  
    setEstado(estado) {
      this.estado = estado;
    }
  
    cambiarContrasena(nuevaContrasena) {
      this.contrasena = nuevaContrasena;
    }
  }
  