const express=require("express");
const{getProduct, getProductById, createProduct, updateProduct, deleteProduct,searchProducts}=require("../controllers/productController");
const router=express.Router();

router.get("/", getProduct);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get('/search', (req, res, next) => {
    console.log('Hit vào ROUTE /search');
    next(); // chuyển tiếp đến controller
  }, searchProducts);

module.exports=router;