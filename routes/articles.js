const express = require('express');
const Article = require('./../modules/article');
const router = express.Router();

// Route to render the "new article" form
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
});

// Route to fetch and display a specific article by its ID
router.get('/:id', async (req, res) => {  // Fetch by ID instead of slug
    try {
        const article = await Article.findById(req.params.id);  // Find article by ID
        if (article == null) {
            return res.redirect('/');
        }
        res.render('articles/show', { article: article });
    } catch (err) {
        console.error('Error fetching article:', err);
        res.redirect('/');
    }
});

// Route to create a new article
router.post('/', async (req, res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    });
    try {
        article = await article.save();
        res.redirect(`/articles/${article.id}`);  // Redirect to the article by its ID
    } catch (e) {
        console.error('Error saving article:', e);
        res.render('articles/new', { article: article });
    }
});

// Route to delete an article by its ID
router.delete('/:id', async (req, res) => {  // Use ID instead of slug for deletion
    try {
        await Article.findByIdAndDelete(req.params.id);  // Use findByIdAndRemove
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting article:', err);
        res.redirect('/');
    }
});

// Route to render the "edit article" form
router.get('/edit/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id); // Find article by ID
        if (article == null) {
            return res.redirect('/');
        }
        res.render('articles/edit', { article: article }); // Render the edit view with the article data
    } catch (err) {
        console.error('Error fetching article for edit:', err);
        res.redirect('/');
    }
});




router.put('articles/:id', async (req, res) => {
    console.log('Request Body:', req.body);
    try {
        const { id } = req.params;
        const { title, markdown } = req.body;

        const article = await Article.findByIdAndUpdate(
            id,
            { title, markdown },
            { new: true }
        ); // Update the article

        if (!article) {
            return res.status(404).send('Article not found');
        }

        res.redirect(`/articles/${id}`); // Redirect to the updated article's page
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).send('Internal Server Error');
    }
});




// router.get('/articles', async (req, res) => {
//     try {
//         const articles = await Article.find(); // Fetch articles from the database
//         res.render('articles', { articles }); // Send articles to EJS
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error fetching articles');
//     }
// });

// router.post('/articles', async (req, res) => {
//     const { title, description } = req.body;
//     try {
//         const newArticle = new Article({ title, description, createdAt: new Date() });
//         await newArticle.save();
//         res.redirect('/articles');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error creating article');
//     }
// });

  

//router.edit()
module.exports = router;
