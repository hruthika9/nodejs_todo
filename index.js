const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));
//app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    console.log("connected to db");
    app.listen(3000, () => console.log("server up and running"));
});

//connection to db
//mongoose.set("useFindAndModify", false);
/*mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("connected to db!");
    app.listen(3000, () => console.log("server up and running"));
});*/
/*mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }).then(() => {
    console.log('connected to db!');
    app.listen(3000, () => console.log("Server Up and running"));
});*/

app.set("view engine", "ejs");

app.get('/', async(req, res) => {
    //console.log("rendering");
    const todoTask = await TodoTask.find();
    res.render("todo.ejs", { todoTask });
});

app.post('/', async(req, res) => {
    //console.log(req.body);
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save().then(() => {
            console.log("task added success");
            res.redirect('/');
        });

    } catch (err) {
        res.redirect('/');
    }
});

app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        else console.log("task deleted success");
        res.redirect("/");
    });
});