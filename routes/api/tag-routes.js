const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    include: {
      model: Product,
      attributes: ["id", "product_name", "price", "stock", "category_id"],
    },
  })
    .then(tagData => {
      if (!tagData) {
        res.json({ message: "No tags found" })
      }
      res.json(tagData)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err);
    })
})

router.get("/:id", (req, res) => {
    // find a single tag by its `id`
    // be sure to include its associated Product data
    Tag.findOne({
      include: {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    })
      .then(tagData => {
        if (!tagData) {
      res.status(404).json({message: 'No tag with the given ID.'})
        }
        res.json(tagData)
  })
      .catch(err => {
      console.log(err)
    res.status(500).json(err);
  })
});

router.post("/", (req, res) => {
    // create a new tag
  Tag.create({ tag_name: req.body.tag_name })
    .then(newTag => {
      if (!newTag) {
      res.status(404).json({ message: "Please enter a valid tag name." });
      return;
      }
      res.json(newTag)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err);
  })
});

router.put("/:id", (req, res) => {
    // update a tag's name by its `id` value
    Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then(updateTag => {
        if (!updateTag) {
          res.status(404).json({ message: "No tag with the given ID." })
          return
        }
        res.json(updateTag)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json(err);
  })
});

router.delete("/:id", (req, res) => {
    // delete on tag by its `id` value
    Tag.destroy(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then(deleteTag => {
    if (!deleteTag) {
      res.status(404).json({ message: "No tag found with the given ID." });
      return;
    }
        res.json(deleteTag)        
      })
      .catch(err => {
        console.log(err)
        res.status(500).json(err);
  })
});

module.exports = router;
