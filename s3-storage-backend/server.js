import express from "express";
import cors from "cors"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();
import { productModel } from "./models/product.model.js";
import connectDB from "./config/db.js" 
connectDB()
const app = express();
app.use(express.json()); // for JSON body
app.use(cors())
app.use(express.urlencoded({ extended: true }));

const port = 3200;

//initilaized client
const client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const createPresignedUrlWithClient = ({ bucket, key }) => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

app.post("/api/get-presigned-url", async (req, res) => {
  const { mime } = req.body;
  //get the presigned url from s3
  const filename = uuidv4();
  const finalName = `${filename}.${mime}`;
  const url = await createPresignedUrlWithClient({
    bucket: process.env.S3_BUCKET_NAME,
    key: finalName,
  });
  res.json({ url: url, finalName: finalName });
});

app.post("/api/products", async(req, res) => {
  //get data from request
  const { name, description, price, filename } = req.body;

  //validate request
  if (!name || !description || !price || !filename) {
    res.json({
      message: "all field are required",
    });
    return;
  }
  //save to database
  const product= await productModel.create({
    name,
    description,
    price,
    filename
  })
  console.log("product",product)
  res.json({
    message: "success product created successfull",
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
