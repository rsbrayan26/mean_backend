import { Request, Response } from 'express';
import Product from '../schemas/ProductSchema';

const getProducts = async (req: Request, res: Response) => {
  const itemsPerPage = 6;
  const page = parseInt(req.query.page as string);
  const startData = (page - 1) * itemsPerPage;
  const endData = startData + itemsPerPage;
  const name = req.body.name;
  console.log('req.session', req.session);
  let products;

  try {
    if (!name) {
      products = await Product.find();
    } else {
      products = await Product.find({ name });
    }
    res.send({
      page: page,
      per_page: itemsPerPage,
      total: products.length,
      total_pages: Math.ceil(products.length / itemsPerPage),
      data: products.slice(startData, endData),
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Hubo un error');
  }
};

const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).send({ mensaje: 'producto no exite' });
    }
    res.send(product);
  } catch (e) {
    console.error(e);
    res.status(500).send('Hubo un error');
  }
};

const postProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    const { name, category, country, price } = new Product(req.body);
    // const date = Date.now();
    const product = await Product.create({
      name,
      category,
      country,
      price,
      user_created: userId,
      date_created: new Date(),
    });
    res.send({ mensaje: 'producto creado', product });
  } catch (e) {
    console.error(e);
    res.status(500).send('Hubo un error en la creación del producto');
  }
};

const putProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, country, price } = req.body;
    const _id = req.params.id;
    const { userId } = req.session;
    let item = await Product.findById(req.params.id);
    if (!item) {
      res.status(404).send({ mensaje: 'producto no exite' });
    } else {
      item.name = name;
      item.category = category;
      item.country = country;
      item.price = price;
      item.user_update = userId;
      // item.date_update = new Date;
      item = await Product.findOneAndReplace({ _id }, item, { new: true });
      res.send({ mensaje: 'producto actualizado' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Hubo un error en la creación del producto');
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    let item = await Product.findById(req.params.id);
    if (!item) {
      res.status(404).send({ mensaje: 'producto no exite' });
    } else {
      item = await Product.findByIdAndDelete({ _id });
      res.send({ mensaje: 'producto eliminado', _id });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Hubo un error en la creación del producto');
  }
};

export default {
  postProduct,
  getProduct,
  getProducts,
  putProduct,
  deleteProduct,
};
