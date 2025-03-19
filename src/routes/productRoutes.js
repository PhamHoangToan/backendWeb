const express=require("express");
const{getProduct, getProductById, createProduct, updateProduct, deleteProduct}=require("../controllers/productController");
const router=express.Router();

router.get("/", getProduct);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports=router;