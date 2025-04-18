const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'png',
    'image/jpg' : 'png',
};

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid image type');
        if(isValid){
            uploadError = null;
        }
      cb(uploadError, 'public/uploads');
    },

    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, fileName + '-' + Date.now())
    }

  });
  
  const uploadOptions = multer({ storage: storage });

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    
    try {
    const category = await Category.findById(req.body.category);
    const file = req.file;

    if(!category) {
        return res.status(400).send(
            'Invalid category provided!'
        );

    }

    if(!file) {
        return res.status(400).send(
            'No image in the request'
        );
    }

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });

    product = await product.save();

    if(!product) {
        return res.status(500).send(
            'The product cannot be save!'
        );

    }

    return res.status(200).send(
        'Product saved successfully!'
    );

} catch (error) {
    res.send(error)
}

});

router.put('/:id', async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid product id');
    }

    const category = await Category.findById(req.body.category);

    if(!category) {

        return res.status(400).send(
            'Invalid category provided!'
        );

    }

    const product = await Product.findByIdAndUpdate(

        req.params.id,

        {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
        },

        {new: true}

    );

    if(!product) {
        return res.status(500).send('Product cannot be updated!')
    }

     res.status(200).send(product);

});

router.put('/gallery-images/:id',
     uploadOptions.array('images', 10), 
     async (req, res) => {

        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid product id');
        }

        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        
        const files = req.files;
        
        if(files) {

            files.map( file => {
                imagesPaths.push(`${basePath}${file.fileName}`);
            });

        }

        const product = await Product.findByIdAndUpdate(
    
            req.params.id,
    
            {
            images: imagesPaths
            },
    
            {new: true}
    
        );

        if(!product) {
            return res.status(500).send('The product cannot be updated!');
        };

});

router.get(`/`, async (req, res) => {

    let filter = {};

    if (req.query.categories) {
        filter = {category: req.query.categories.split(',')};
    }

    const productList = await Product.find(filter).populate('category');

    if (!productList) {

        return res.status(500).json({
            success: false,
            message: 'Internal server error!'
        });

    } else {

        return res.status(200).json({
            productList
        });

    }

});

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        return res.status(404).json({
            success: false,
            message: `Product with id: ${product} not found!`
        });
    }
    return res.status(200).send(product);
});

router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments();
    if(!productCount) {
        return res.status(500).json({
            success: false,
            message: 'Interal server error!'
        });
    }
    return res.status(200).json({
        success: true,
        productCount: productCount
    });
});

router.get('/get/featured', async (req, res) => {
    const products = await Product.find({
        isFeatured: true
    });
    if(!products) {
        return res.status(500).json({
            success: false,
            message: 'Interal server error!'
        });
    }
    return res.status(200).json(products);
});

router.delete('/:id', async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found!'
        });
    } else {
        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully!'
        });
    }
});


module.exports = router;