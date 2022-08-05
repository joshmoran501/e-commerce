const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
  // find all categories    
  // be sure to include its associated Products
  const categoryData = await Category.findAll({
    include: {model: Product},
    attributes: {
      include: [
        'id', 'product_name', 'price', 'stock', 'category_id'
      ]}
  })
  res.status(200).json(categoryData) 
  } catch (err) {
    res.status(500).json(err)
  } 
});

router.get('/:id', async (req, res) => {
  try {
  // find one category by its `id` value
  // be sure to include its associated Products
  const categoryData = await Category.findByPk({
    where: {
      id: req.params.id
    },
    include: {
      model: Product,
    },
    attributes: {
      include: [
        'id', 'product_name', 'price', 'stock', 'category_id'
      ]
    }
  })

  if(!categoryData) {
    res.status(404).json({message:"No category found with that ID"})
    return
  }

  res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.post('/', async (req, res) => {
  try {
  // create a new category
  const newCategory = await Category.create(req.body)

  if(!newCategory) {
    res.status(404).json({message: "Please enter a valid category name."})
    return
  }

  res.status(200).json(newCategory)
  } catch (err) {
    res.status(400).json(err)
  }
});

router.put('/:id', async (req, res) => {
  try {
  // update a category by its `id` value
  const updateCategory = await Category.update(req.body, {
    where: {
      id: req.params.id
    }
  })

  if(!updateCategory) {
    res.status(404).json({message: "No category found with the given ID."})
    return
  }

  res.status(200).json(updateCategory)
  } catch (err) {
    res.status(400).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  try {
  // delete a category by its `id` value
  const deleteCategory = await Category.destroy(req.body, {
    where: {
      id: req.params.id
    }
  })

  if(!deleteCategory) {
    res.status(404).json({message: "No category found with the given ID."})
    return
  }

  res.status(200).json(deleteCategory)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
