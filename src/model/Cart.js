const db=require('../config/db')

const Cart={
    getAll: async ()=>{
        const [rows] =await db.query (
            `SELECT cart.cart_id, cart.user_id, cart.product_id, products.product_name, cart.quantity
            FROM cart
            INNER JOIN products ON cart.product_id = products.product_id`
        );
        return rows;
    },
    getCartByUser: async (user_id) => {
        const [rows] = await db.query(`
          SELECT 
            cart.*, 
            products.product_name, 
            products.price, 
            products.image 
          FROM cart
          JOIN products ON cart.product_id = products.product_id
          WHERE cart.user_id = ?
        `, [user_id]);
        
        return rows;
      },
      

    addToCart: async (user_id, product_id, quantity) => {
        try {
          const [rows] = await db.query(
            `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`,
            [user_id, product_id]
          );
      
          if (rows.length > 0) {
            // Nếu đã có, cập nhật số lượng
            const existingQuantity = rows[0].quantity;
            const newQuantity = existingQuantity + quantity;
      
            const [result] = await db.query(
              `UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?`,
              [newQuantity, user_id, product_id]
            );
      
            console.log('Cập nhật số lượng:', result);
            return rows[0].id; // hoặc result.insertId nếu cần
          } else {
            // Nếu chưa có, thêm mới
            const [result] = await db.query(
              `INSERT INTO cart(user_id, product_id, quantity) VALUES (?, ?, ?)`,
              [user_id, product_id, quantity]
            );
      
            console.log('Thêm mới sản phẩm vào giỏ hàng:', result);
            return result.insertId;
          }
        } catch (error) {
          console.error("Lỗi addToCart:", error);
          throw error; // để backend trả về lỗi cho frontend
        }
      },
      

      updateQuantity: async (cart_id, quantity) => {
        try {
          if (!cart_id || quantity === undefined) {
            throw new Error("Thiếu cart_id hoặc quantity");
          }
      
          const [result] = await db.query(
            `UPDATE cart SET quantity = ? WHERE cart_id = ?`,
            [quantity, cart_id]
          );
      
          return result.affectedRows;
        } catch (error) {
          console.error("Lỗi khi cập nhật số lượng cart:", error);
          throw error;
        }
      },
      


    deleteItem: async(cart_id)=>{
        const [result]=await db.query(
            `DELETE FROM cart WHERE cart_id=?`,
            [cart_id]
        );
        return result.affectedRows;
    },

    clearCart: async(user_id)=>{
        const [result]=await db.query(
            `DELETE FROM cart WHERE user_id=?`,
            [user_id]
        );
        return result.affectedRows;
    }
};
module.exports =Cart;