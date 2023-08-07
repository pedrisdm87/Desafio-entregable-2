import fs from "fs";


class ProductManager {
  #path = "./products.js";
  #_products = [];

  constructor() {
    this.#init();
  }

  async #init() {
    try {
      await fs.access(this.#path);
      let data = await fs.readFile(this.#path, "utf-8");
      if (!data.trim()) {
        await fs.writeFile(this.#path, JSON.stringify([], null, 2));
        this.#_products = [];
      } else {
        this.#_products = JSON.parse(data);
      }
    } catch (error) {
      await fs.promises.writeFile(this.#path, JSON.stringify([], null, '/t'));
    }
  }

  async getProducts() {
    let data = await fs.promises.readFile(this.#path, "utf-8");
    const products = JSON.parse(data);
    return products;
  }

  #getNextID(products) {
    return products.length === 0 ? 1 : products[products.length - 1].id + 1;
  }

  async getProductsById(id) {
    let data = await fs.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    let product = products.find((item) => item.id === id);
    if (!product) return `[ERR] Not found id product`;
    return product;
  }

  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    )
      return `[ERR] Required fields missing`;

    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);

    const found = products.find((item) => item.code === product.code);
    if (found) {
      return `[ERR] Code already in use`;
    }

    const productToAdd = { id: this.#getNextID(products), ...product };
    products.push(productToAdd);
    await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2));
    return productToAdd;
  }

  async deleteProduct(id) {
    let data = await fs.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    let newProducts = products.filter((item) => item.id !== id);
    if (products.length !== newProducts.length) {
      await fs.writeFile(this.#path, JSON.stringify(newProducts, null, 2));
      return newProducts;
    } else {
      return `[ERR] Product does not exist`;
    }
  }

  async updateProduct(id, updatedProduct) {
    let data = await fs.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    let newProducts = products.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...updatedProduct,
        };
      } else return item;
    });
    await fs.writeFile(this.#path, JSON.stringify(newProducts, null, 2));
    return newProducts.find((item) => item.id === id);
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

(async () => {
  await pm.addProduct(product1);
  await pm.addProduct(product2);

  console.log(await pm.getProducts());
})();


export default ProductManager;