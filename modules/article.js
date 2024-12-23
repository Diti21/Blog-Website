const mongoose = require('mongoose');
const { marked } = require('marked');

const createDomPurifier = require('dompurify');
const { JSDOM } = require('jsdom');
const domPurify = createDomPurifier(new JSDOM().window);

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    // description: {
    //     type: String, // Not required, but you can change this to `required: true` if needed
    // },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    sanitizedHtml: {
        type: String,
     
    }
});

// Pre-save hook to sanitize markdown and generate HTML
articleSchema.pre('save', function (next) {
    if (this.isModified('markdown') || this.isNew) {
        console.log('Sanitizing markdown and generating HTML...');
        this.sanitizedHtml = domPurify.sanitize(marked(this.markdown));
    }
    next();
});

// Method to convert markdown to sanitized HTML
articleSchema.methods.toHTML = function () {
    const html = marked.parse(this.markdown);  // Use marked.parse() instead of marked()
    
    return domPurify.sanitize(html);
};


module.exports = mongoose.model('Article', articleSchema);
