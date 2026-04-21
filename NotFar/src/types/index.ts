export type Nodo = string;

export type Grafo = {
  [key: string]: {
    [key: string]: number;
  };
};

export type Tecnico = {
  id: string;
  ubicacion: Nodo;
  disponible: boolean;
  tipo: string;
};
