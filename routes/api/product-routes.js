const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
  // find all products
  // be sure to include its associated Category and Tag data
  const productData = await Product.findAll({
    include: [
      {
        model: Category,
        attributes: ['id', 'category_name']
      },
      {
        model: Tag,
        attributes: ['id', 'tag_name']
      }
    ]
  })
  res.status(200).json(productData)
  } catch (err) {
    res.status(500).json(err)
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  const productData = await Product.findByPk({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Category,
        attributes: ['id', 'category_name']
      },
      {
        model: Tag,
        attributes: ['id', 'tag_name']
      }
    ]
  })

  if(!productData) {
    res.status(404).json({message: "No category found with that ID"})
    return
  }

  res.status(200).json(productData)
  } catch (err) {
    res.status(500).json(err)
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tag_ids: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tag_ids.length) {
        const producttag_idArr = req.body.tag_ids.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(producttag_idArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((producttag_ids) => res.status(200).json(producttag_ids))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const producttag_ids = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tag_ids
        .filter((tag_id) => !producttag_ids.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tag_ids.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  try {
  // delete one product by its `id` value
  const deleteProduct = await Product.destroy(req.body, {
    where: {
      id: req.params.id
    }
  })

  if(!deleteProduct) {
    res.status(404).json({message: "No category found with the given ID."})
    return
  }

  res.status(200).json(deleteProduct)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
