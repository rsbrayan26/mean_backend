import { Request, Response } from 'express';
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../schemas/UserSchema';

dotenv.config();

const getUsers = async (req: Request, res: Response) => {
  const itemsPerPage = 10;
  const page = parseInt(req.query.page as string);
  const startData = (page - 1) * itemsPerPage;
  const endData = startData + itemsPerPage;
  const name = req.body.name;
  let users;

  try {
    if (!name) {
      users = await User.find();
    } else {
      users = await User.find({ name });
    }
    res.send({
      page: page,
      per_page: itemsPerPage,
      total: users.length,
      total_pages: Math.ceil(users.length / itemsPerPage),
      data: users.slice(startData, endData),
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Hubo un error');
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send({ mensaje: 'El usuario no existe' });
    }
    res.send(user);
  } catch (e) {
    console.error(e);
    res.status(500).send('Hubo un error');
  }
};

const postUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = new User(req.body);
    const hash = await bcrypt.hash(password, 15);
    const newUser = await User.create({
      name,
      email,
      password: hash,
    });
    res.send({ mensaje: 'Usuario creado', newUser });
  } catch (e) {
    console.error(e);
    res.status(500).send('Hubo un error en la creación del usuario');
  }
};

const putUser = async (req: Request, res: Response) => {
  try {
    const { name, email, status } = req.body;
    const _id = req.params.id;
    const { userId } = req.session;
    let item = await User.findById(req.params.id);
    if (!item) {
      res.status(404).send({ mensaje: 'El usuario no existe' });
    } else {
      item.name = name;
      item.email = email;
      item.status = status;
      item.date_update = new Date();
      item.user_update = userId;

      item = await User.findOneAndReplace({ _id }, item, { new: true });
      res.send({ mensaje: 'usuario actualizado', item });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Hubo un error en la creación del producto');
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    let item = await User.findById(req.params.id);
    if (!item) {
      res.status(404).send({ mensaje: 'producto no exite' });
    } else {
      item = await User.findByIdAndDelete({ _id });
      res.send({ mensaje: 'producto eliminado', _id });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Hubo un error en la creación del producto');
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw { message: 'user not found' };

    const isOk = await bcrypt.compare(password, user!.password);
    if (!isOk) throw { message: 'password invalid' };

    const expiresIn = process.env.JWT_TIME;
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn,
      },
    );
    res.send({ token, expiresIn });
  } catch (e) {
    res.status(404).send({ code: 404, message: e });
  }
};

export default {
  postUser,
  getUser,
  getUsers,
  putUser,
  deleteUser,
  login,
};
