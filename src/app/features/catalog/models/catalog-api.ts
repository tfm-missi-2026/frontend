// Shape del backend (CatalogoResponse.java) tal cual viaja por wire.
// Los nombres vienen en espanol del backend; el UI los renombra en el mapper.
export interface CatalogoApi {
  id: string;
  grupo: string;
  idOpcion: number;
  opcion: string;
  estado: number;
}

export interface CatalogoCrearApi {
  grupo: string;
  idOpcion: number;
  opcion: string;
}
