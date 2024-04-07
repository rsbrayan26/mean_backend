import express from 'express';
import connectionBD from './config/connectionBD';
import product from './routes/productRoute';
import userRoute from './routes/userRoute';
const PORT = 5500;
const app = express();

connectionBD();
console.log(new Date());

app.use(express.json());

app.use('/api/productos', product.router);
app.use('/api/usuarios', userRoute.router);

app.listen(PORT, () => {
  console.log('el servidor esta corriendo');
});
