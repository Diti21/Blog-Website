const express = require('express');
const mongoose = require('mongoose');
const articleRouter = require('./routes/articles');
const methodOverride = require('method-override');
const app = express();
const Article = require('./modules/article.js');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.static('public')); // Static files
//app.use(express.urlencoded({ extended: false })); // Body parser
app.use(methodOverride('_method')); // Override methods for DELETE
app.use(express.urlencoded({ extended: true }));

// View Engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Routes
app.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: 'desc' });
        res.render('articles/index', { articles: articles });
    } catch (err) {
        console.error('Error fetching articles:', err);
        res.status(500).send('Error loading articles');
    }
});

mongoose.connection.once('open', async () => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        if (collections.some(col => col.name === 'articles')) {
            console.log('Dropping existing articles collection...');
            await mongoose.connection.db.dropCollection('articles');
        }
    } catch (err) {
        console.error('Error dropping collection:', err);
    }
    console.log('MongoDB setup complete.');
});


app.get('/', async (req, res) => {
    console.log('Request Body:', req.body);
    try {
        const articles = await Article.find().sort({ createdAt: 'desc' });
        res.render('articles/index', { articles: articles });
    } catch (err) {
        console.error('Error fetching articles:', err);
        res.status(500).send('Error loading articles');
    }
});


app.put('/articles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, markdown } = req.body;

        const article = await Article.findByIdAndUpdate(id, { title, markdown }, { new: true });
        if (!article) {
            return res.status(404).send('Article not found');
        }
        res.redirect(`/articles/${id}`);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});



// Use the article router for all routes starting with /articles
app.use('/articles', articleRouter);

// Start the Server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
