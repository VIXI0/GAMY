const { gql } = require('apollo-server-express');

module.exports = gql`
type Query {

  hello: String
  greet(name: String): String


  Suplidores: [Suplidor]!
  SuplidoresAll: [Suplidor]!
  Productos: [Producto]!
  ProductosAll: [Producto]!
  marcas: [marca]!
  marcasAll: [marca]!
  usuarios: [usuario]!
  roles: [role]
  getRole: role!
  currentU: String!
  backs: [back]!
  logout: String
}

type Suplidor {
  _id: ID
  nombre: String
  direccion: String
  telefono: [String]
  rnc: String
  ncf: String
  Representante: String
  telefonor: [String]
  anotaciones: String
  active: Boolean
}

type Producto {
  _id: ID
  nombre: String
  marca: String
  ref: String
  image: String
  descripcion: String
  location: String
  cantidad: Float
  unidad: String
  Suplidor_primario: String
  active: Boolean
}



type usuario {
  _id: ID
  user: String
  password: String
  active: Boolean
  role: ID
}

type role {
  _id: ID
  nombre: String
  permisos: [sistema]
}

type sistema {
  sistema: String
  link: String
  menu: [menu]
}

type menu {
  titulo: String
  menu: Boolean
  sub: [sub]
}

type sub {
  tipo: String
  titulo: String
  link: String
  href: String
  target: String
  c: Boolean
  r: Boolean
  u: Boolean
  d: Boolean
  a: Boolean
  sub: [sub2]
}

type sub2 {
  tipo: String
  titulo: String
  link: String
  href: String
  target: String
  c: Boolean
  r: Boolean
  u: Boolean
  d: Boolean
  a: Boolean
  sub: [sub3]
}

type sub3 {
  tipo: String
  titulo: String
  link: String
  href: String
  target: String
  c: Boolean
  r: Boolean
  u: Boolean
  d: Boolean
  a: Boolean
}

type marca {
  _id: ID
  nombre: String!
  active: Boolean
}

type back {
  _id: ID
  user: String
  date: String
  location: String
}

type createAnswer {
  _id: ID
  done: Boolean
}
  type Mutation {


    createUser(input: UsuarioInput): Boolean
    login(input: UsuarioInput): String

    createRole(input: RoleInput): Boolean
    updateRole(_id: ID, input: RoleInput): Boolean


    createSuplidor(input: SuplidorInput): createAnswer
    updateSuplidor(_id: ID, input: SuplidorInput): Boolean

    createProducto(input: ProductoInput): createAnswer
    updateProducto(_id: ID, input: ProductoInput): Boolean
    getProductoRef(ref: String): Producto

    createMarca(input: marcaInput): createAnswer
    updateMarca(_id: ID, input: marcaInput): Boolean

    createBack(input: backInput): Boolean

    uploadImage(image: Upload!): Boolean
  }


  input UsuarioInput {
    user: String!
    password: String!
    createdAt: String
    active: Boolean
    role: ID
  }

  input RoleInput {
    nombre: String
    permisos: [sistemaM]
  }


  input sistemaM {
    sistema: String
    link: String
    menu: [menuM]
  }

  input menuM {
    titulo: String
    menu: Boolean
    sub: [subM]
  }

  input subM {
    tipo: String
    titulo: String
    link: String
    href: String
    target: String
    c: Boolean
    r: Boolean
    u: Boolean
    d: Boolean
    a: Boolean
    sub: [sub2M]
  }

  input sub2M {
    tipo: String
    titulo: String
    link: String
    href: String
    target: String
    c: Boolean
    r: Boolean
    u: Boolean
    d: Boolean
    a: Boolean
    sub: [sub3M]
  }

  input sub3M {
    tipo: String
    titulo: String
    link: String
    href: String
    target: String
    c: Boolean
    r: Boolean
    u: Boolean
    d: Boolean
    a: Boolean
  }

  input SuplidorInput {
    nombre: String
    direccion: String
    telefono: [String]
    rnc: String
    ncf: String
    Representante: String
    telefonor: [String]
    anotaciones: String
    active: Boolean
  }

  input ProductoInput {
    nombre: String
    marca: String
    ref: String
    image: String
    descripcion: String
    location: String
    cantidad: Float
    unidad: String
    Suplidor_primario: String
    active: Boolean
  }

  input marcaInput {
    nombre: String
    active: Boolean
  }

  input backInput {
    user: String
    location: String
  }
`;
