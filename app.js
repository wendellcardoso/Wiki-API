const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////////////Requests Targetting all Articles//////////////////////////////////

app.route("/articles")
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        })
    })

    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err) => {
            if (!err) {
                res.send("Succesfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully deleted all articles");
            } else {
                res.send(err);
            }
        })
    });

///////////////////////////////////////////////Requests Targetting A Specific Articles//////////////////////////////////

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (!err) {
                if (foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send("No articles matching that title was found.")
                }
            } else {
                res.send(err);
            }
        });
    })

    .put((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            (err) => {
                if (!err) {
                    res.send("Atualizado com sucesso!");
                } else {
                    res.send(err);
                }
            }
        );

    });

app.listen(3000, () => { console.log("Server started on port 3000.") });