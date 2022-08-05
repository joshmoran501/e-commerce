const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
  // find all tags
  // be sure to include its associated Product data
  const tagData = await Tag.findAll({
    include: {model: Product},
    attributes: {
      include: [
        'id', 'product_name', 'price', 'stock', 'category_id'
      ]}
  })
  res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.get('/:id', async (req, res) => {
  try{
  // find a single tag by its `id`
  // be sure to include its associated Product data
  const tagData = await Tag.findByPk({
    include: {model: Product},
    attributes: {
      include: [
        'id', 'product_name', 'price', 'stock', 'category_id'
      ]}
  })

  if (!tagData){
    res.status(404).json({message:"No tag found with that ID"})
    return
  }
  res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.post('/', async (req, res) => {
  try{
  // create a new tag
  const newTag = await Tag.create(req.body)

  if(!newTag) {
    res.status(404).json({message: "Please enter a valid tag name."})
    return
  }
  res.status(200).json(newTag)
  } catch (err) {
    res.status(400).json(err)
  }
});

router.put('/:id', async (req, res) => {
  try {
  // update a tag's name by its `id` value
  const updateTag = await Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })

  if(!updateTag) {
    res.status(404).json({message: "No tag found with the given ID."})
    return
  }

  res.status(200).json(updateTag)
  } catch (err) {
    res.status(400).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  try{
  // delete on tag by its `id` value
  const deleteTag = await Tag.destroy(req.body, {
    where: {
      id: req.params.id
    }
  })

  if(!deleteTag) {
    res.status(404).json({message: "No tag found with the given ID."})
    return
  }

  res.status(200).json(deleteTag)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
