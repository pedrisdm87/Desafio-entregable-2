import {promises as fs} from "fs"



export default class ProductManager {
  _products; 

  constructor() {
    this._products = [];
    this.patch = ".productos.txt";
  }

  
  getProducts = async () => {
    let respuesta2 = await this.readProducts()
    return console.log(respuesta2)
  }

  getNextID() {
    if (this.#_products.length === 0) return 1;
    return this.#_products[this.#_products.length - 1].id + 1;
  }
  };

  getProductsById = async (id) => {
    let respuesta3 = await this.readProducts()
    if(!respuesta3.find(item => item.id === id)){
      console.log("No se encuentra el producto")
  } else{
      console.log(respuesta3.find(product => product.id === id));
  }
  }


   addProduct = async(product) => {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    )
      return `[ERR] Required fields missing`;

    const found = this._products.find((item) => item.code === product.code);

    if (found) {
      return `[ERR] Code already in use`;
    }

    const productToAdd = { id: this.getNextID(), ...product };
    this._products.push(productToAdd);
    await fs.writeFile(this.patch, JSON.stringify(this._products));
    return productToAdd;
  }
  readProducts = async () => {
    let respuesta = await fs.readFile(this.patch, "utf-8")
    return JSON.parse(respuesta)
  }
 

  deleteProductsById = async (id) => {
    let respuesta3 = await this.readProducts()
    let productFilter = respuesta3.filter(products => products.id != id)
    await fs.writeFile(this.patch, JSON.stringify(productFilter));
    
    console.log("Se ha encontrado el producto")

    updateProducts = async ({id, ...producto}) => {
      await this.deleteProductsById(id);
      let oldProduct = await this.readProducts()
      let modifiedProduct = [{ ...producto, id }, ...oldProduct];
      await fs.writeFile(this.patch, JSON.stringify(modifiedProduct));
    
  }
}


const pm = new ProductManager(); 

const product1 = {
  title: `Oppenheimer`,
  description: `Biografia`,
  price: 2500,
  thumbnail: `Movie.jpg`,
  code: 1,
  stock: 200,
};
const product2 = {
  title: `Barbie`,
  description: `Infantil`,
  price: 2500,
  thumbnail: `Movie.jpg`,
  code: 2,
  stock: 200,
};

pm.addProduct(product1);
pm.addProduct(product2);


console.log(pm.getProducts()); 


