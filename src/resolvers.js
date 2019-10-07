//importacion conection
const { MyQ } = require('./MyS');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const checkAuth = require('../util/check-auth');
const {SECRET_KEY} = require('../config');

const { UserInputError } = require('apollo-server-express');

//const path = require("path");
//const { createWriteStream} = require("fs");

//var Cron = require('./bmdb.js');
//resolvedor de eschemas
module.exports = {


  Query: {


    greet: (root,args) => {
      MyS.query("select * from supplier;", function (err, res) {

                if(err) {
                    console.log("error: ", err);
                }
                else{
                    console.log(res);
                }
            });
      return `hellow ${args.name}`
    },

    async usuarios(_,{req}, context) {
      checkAuth(context)
      //return await UsuarioMM.find()
    },

    async roles(_,{req}, context) {
      //checkAuth(context)


      let res = await MyQ("select * from roles;");

      res.forEach( function(part, index) {
        this[index].permission = JSON.parse( this[index].permission );
      }, res);
       return res;

    },

    async getRole(_,{req}, context) {
      const auth = checkAuth(context);
      let rol = await MyQ('SELECT * FROM roles WHERE role_id = ?;',[auth.role_id]);
      rol[0].permission = JSON.parse( rol[0].permission );
      return rol[0];
    },

    async currentU(_,{req}, context){
      const auth = checkAuth(context)
      return auth.name
    },

    //cerrar session
    logout(_,{req},context){
      checkAuth(context)
      const token = jwt.sign({
        expired: 'expired'
      }, SECRET_KEY, {expiresIn: '1s'})

      return token
    },

    //Suplidor
    async Suplidores(_,{req}, context) {
      checkAuth(context)
      //return await SuplidorMM.find({active: true})
    },

    async SuplidoresAll(_,{req}, context) {
      checkAuth(context)
      //return await SuplidorMM.find()
    },

    //Producto
    async Productos(_,{req}, context) {
      checkAuth(context)
      //return await ProductoMM.find({active: true})
    },

    async ProductosAll(_,{req}, context) {
      checkAuth(context)
      //return await ProductoMM.find()
    },

    //Marcas
    async marcas(_,{req}, context) {
      checkAuth(context)
      //return await MarcaMM.find({active: true})
    },

    async marcasAll(_,{req}, context) {
      checkAuth(context)
      //return await MarcaMM.find()
    },

    //Backups
    async backs(_,{req}, context) {
      checkAuth(context)
      //return await BackMM.find()
    }
  },



  Mutation: {

    //user
    async login(_, {input},context){

      let user = await MyQ('select employs.employ_id AS employ_id, employs.username AS username, employs.password AS password, employs.active AS active, employs.role_id AS role_id, persons.name AS name from employs RIGHT JOIN persons ON employs.person_id = persons.person_id WHERE employs.username = ?;', [input.username]);


      if(!user[0]){
        return "Usuario no existente"
      }
      if(user[0].active < 1){
        return "Usuario inactivo"
      }
      const match = await bcrypt.compare(input.password,user[0].password)
      if(!match){
        return "Contraseña incorrecta";
      }
      const token = jwt.sign({
        employ_id: user[0].employ_id,
        name: user[0].name,
        role_id: user[0].role_id
      }, SECRET_KEY, {expiresIn: '24h'})

      return token
    },


    async createUser(_, {input},context){
      const auth = checkAuth(context)
      try {
        const look = input.user
        const user = await UsuarioMM.findOne({user: look})
        if (user){
          throw new UserInputError("El usuario ya existe",{
            errors: {
              username: "this username is taken"
            }
          })
        }


        input.password = await bcrypt.hash(input.password,12)
        input.createdAt = new Date().toISOString()
        const newUser = new UsuarioMM(input)
        const res = await newUser.save()

        /*const token = jwt.sign({
          id: res.id,
          user: res.user
        }, SECRET_KEY, {expiresIn: '24h'})*/

        return true

      } catch (e) {

        return false

      }

    },

    //roles
    async createRole(_, {input},context){
      const auth = checkAuth(context)
      try {
        const look = input.nombre
        const role = await RoleMM.findOne({nombre: look})
        if (role){
          throw new UserInputError("El nombre role ya existe", {
            errors: {
              username: "this role name is used"
            }
          })
        }


        const newRole = new RoleMM(input)
        const res = await newRole.save()


        return true

      } catch (e) {

        return false

      }

    },

    async updateRole(_, {_id, input},context){
        const auth = checkAuth(context)
      try {
        await RoleMM.findByIdAndUpdate(_id,input, {new: true, useFindAndModify: false})
        return true
      } catch (e) {
        return false
      } finally {

      }
    },

    //suplidor
    async createSuplidor(_, {input},context) {
      const auth = checkAuth(context)
      try {



        const newSuplidor = new SuplidorMM(input)
        await newSuplidor.save()
        const obj = {
          _id: newSuplidor._id,
          done: true
        }
        return obj

      } catch (e) {

        const obj = {
          _id: '',
          done: false
        }
        return obj

      } finally {

      }

    },

    async updateSuplidor(_, {_id, input},context){
        const auth = checkAuth(context)
      try {
        await SuplidorMM.findByIdAndUpdate(_id,input, {new: true, useFindAndModify: false})
        return true
      } catch (e) {
        return false
      } finally {

      }
    },

    //producto
    async createProducto(_, {input},context) {
        const auth = checkAuth(context)
      try {

        const newProducto = new ProductoMM(input)
        if (input.ref === ''){
          newProducto.ref = newProducto._id
        }
        await newProducto.save()
        const obj = {
          _id: newProducto._id,
          done: true
        }
        return obj

      } catch (e) {

        const obj = {
          _id: '',
          done: false
        }
        return obj

      } finally {

      }

    },

    async updateProducto(_, {_id, input},context){
        const auth = checkAuth(context)
      try {
        await ProductoMM.findByIdAndUpdate(_id,input, {new: true, useFindAndModify: false})
        return true
      } catch (e) {
        return false
      } finally {

      }
    },

    async getProductoRef(_,{ ref }, context){
        const auth = checkAuth(context)
        const producto = await ProductoMM.findOne({ref: ref})
        if (producto) {
          return producto
        } else {
          throw new UserInputError('Not Found', {
          invalidArgs: ref,
        });
        }
    },

    //marcas
    async createMarca(_, {input},context) {
        const auth = checkAuth(context)
      try {

        const newMarca = new MarcaMM(input)
        await newMarca.save()
        const obj = {
          _id: newMarca._id,
          done: true
        }
        return obj

      } catch (e) {

        const obj = {
          _id: '',
          done: false
        }
        return obj

      } finally {

      }

    },

    async updateMarca(_, {_id, input},context){
        const auth = checkAuth(context)
      try {
        await MarcaMM.findByIdAndUpdate(_id,input, {new: true, useFindAndModify: false})
        return true
      } catch (e) {
        return false
      } finally {

      }
    },

    //backup
    async createBack(_,{input},context){
      const auth = checkAuth(context)
      const DBA = await Cron.dbAutoBackUp(input.user,input.location);
      if (auth.user == "System") {
        input.location = "default"
      }
      if (DBA) {
        const obj = {
          user: auth.user,
          date: new Date().toISOString(),
          location: input.location
        }
        const newBack = new BackMM(obj)
        await newBack.save()
      }
      return DBA
    },

    async uploadImage(_, { image },context){

        const { createReadStream, filename } = await image;

        await new Promise( res =>
          createReadStream()
            .pipe(createWriteStream(path.join("C:\\GAS\\images", filename)))
            .on("close", res)
        );
        return true;
}

  }
};
