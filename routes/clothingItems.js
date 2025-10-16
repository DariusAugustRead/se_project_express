const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItems");

const { likeItem, dislikeItem } = require("../controllers/likes");

console.log("✅ clothingItemsRouter file loaded");

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all clothing items
 *     tags:
 *       - ClothingItems
 *     responses:
 *       200:
 *         description: A list of clothing items
 */
router.get("/", getItems);

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new clothing item
 *     tags:
 *       - ClothingItems
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               weather:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item created successfully
 */
router.post("/", auth, createItem);

/**
 * @swagger
 * /items/{itemId}:
 *   delete:
 *     summary: Delete a clothing item
 *     tags:
 *       - ClothingItems
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 */
router.delete("/:itemId", auth, deleteItem);

/**
 * @swagger
 * /items/{itemId}/likes:
 *   put:
 *     summary: Like a clothing item
 *     tags:
 *       - ClothingItems
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item liked successfully
 */
router.put("/:itemId/likes", auth, likeItem);

/**
 * @swagger
 * /items/{itemId}/likes:
 *   delete:
 *     summary: Dislike a clothing item
 *     tags:
 *       - ClothingItems
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item disliked successfully
 */
router.delete("/:itemId/likes", auth, dislikeItem);

router.get("/", getItems);
router.post("/", auth, createItem);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
