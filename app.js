import express from "express";
import posts from "./data/posts.js";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//**** view all posts ****
app.get("/", (req, res) => {
    console.log("This is the home page.I can view all posts and it's title. I can see a form to add a new post at the bottom");
    console.log("  ");
    res.render("index.ejs", { posts }); // the second param must be an object, therefor {} needed.
})

// **** Add Function ****
// ❌ 如果把添加表单直接放在首页，就不需要 /add 路由，也不需要 res.render("add.ejs")。首页的 GET / 把表单和已有的 posts 一起渲染到 index.ejs,表单的提交 action 还是走 POST /add
// app.get("/add", (req, res) => {
//     console.log("Display the form to add an new post !");
//     res.render("add.ejs");
// })

app.post("/add", (req, res) => {
    console.log("This router handles incoming data from form for adding new post. After saving the data, redirect to the home page!")

    console.log("  ");
    const newId = new Date();
    const now = `${newId.getFullYear()}-${newId.getMonth() + 1}-${(newId.getDate())}`;
    //getMonth() 是从 0 开始的，要 +1

    const newPost = {
        id: Date.now(),
        title: req.body.title,
        date: now,
        image: req.body.image,
        content: req.body.content,
    }

    // posts.push(newPost); // push是把新post放在表单最后
    posts.unshift(newPost);

    res.redirect(`/posts/${newPost.id}`);
})

// view one post by id
app.get("/posts/:id", (req, res) => {
    const idFromUrl = Number(req.params.id); // 从 URL 拿到 id，转成数字
    const post = posts.find(p => p.id === idFromUrl); // 在数据里找对应帖子

    if (post) {
        res.render("post.ejs", { post });
    } else {
        res.status(404).send("Post Not Found.");
    };
})

// Edit function
app.get("/posts/:id/edit", (req, res) => {
    console.log("This router display the form for editing the article, once submit, the data will be sent to post method router")
    console.log(" ")
    const idToEdit = Number(req.params.id);
    const post = posts.find(p => p.id === idToEdit);
    if (post) {
        res.render("edit.ejs", { post });
    } else {
        res.status(404).send("Post Not Found,");
    };
})

app.post("/posts/:id/edit", (req, res) => {
    const idTOEdit = Number(req.params.id); //从url中取出id

    // 从表单中取出以下内容：
    const title = req.body.title;
    const image = req.body.image;
    const content = req.body.content;

    // 从posts数组中找到id匹配的那一篇
    const post = posts.find(function (p) {
        return p.id === idTOEdit;
    });

    // 如果找到了，就更新它的内容：
    if (post) {
        post.title = title;
        post.image = image;
        post.content = content;
        // 然后跳转到这篇文章的详细页
        res.redirect("/posts/" + idTOEdit);
    } else {
        res.status(404).send("Post Not Found,");
    };
})

// Delete function，用post的方式来代替delete
app.post("/posts/:id/delete", (req, res) => {
    const idToDelete = Number(req.params.id);
    const index = posts.findIndex(post => (post.id === idToDelete));
    // splice(startIndex, numberItemsToRemove, Item1 ,Item2)
    posts.splice(index, 1)
    res.redirect("/");
})


app.listen(port, () => {

    console.log(`Listening on port ${port}!`)
})