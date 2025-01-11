import { serve } from "bun";
import figlet from "figlet";

const PORT = 3049;

interface Post{
    id: string;
    title: string;
    content: string;
}

let blogPosts: Post[] = [];

function handleGetAllPosts(){
    return new Response(JSON.stringify(blogPosts), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

function handleGetPostById(id: string){
    const post = blogPosts.find((post) => post.id == id);
    if (post){
        return new Response(JSON.stringify(post), {
            headers: {
                "Content-Type": "application/json"
            }
        });
    }else{
        return new Response('Not Found', {status: 404});
    }
} 


function handleCreatePost(title: string, content: string){
    const newPost: Post = {
        id: `${blogPosts.length }`,
        title,
        content,
    }

    blogPosts.push(newPost);
    return new Response(JSON.stringify(newPost), {
        headers: {"Content-Type": "application/json"},
        status: 201,
    });
}

function handleUpdatePost(id: string, title: string, content: string){
    const postIndex = blogPosts.findIndex((post) => post.id == id);
    if (postIndex === -1){
        return new Response('Not Found', {status: 404});
    }
    blogPosts[postIndex] = {
        ...blogPosts[postIndex],
        title,
        content,
    }
    return new Response('Post Updated', {status: 200});
}
function handleDeletePost(id: string){
    const postIndex = blogPosts.findIndex((post) => post.id == id);
    if (postIndex === -1){
        return new Response('Not Found', {status: 404});
    }
    blogPosts.splice(postIndex, 1);
    return new Response('Post Deleted', {status: 200});
}

serve({
    port:PORT,
    async fetch(request){
        // const body = figlet.textSync("Hey There !");
        const {method} = request;
        const {pathname} = new URL(request.url);
        const pathRegexForID = /^\/api\/posts\/(\d+)$/;

        if (method == "GET" && pathname == "/api/posts"){
            const match = pathname.match(pathRegexForID);
            const id = match && match[1];
            if (id){
                return handleGetPostById(id);
            }
        }

        if (method == "GET" && pathname == "/api/posts"){
            return handleGetAllPosts();
        }
        
        if (method == "POST" && pathname == "/api/posts"){
            const newPost = await request.json();
            return handleCreatePost(newPost.title, newPost.content);
        }

        if (method == "PATCH" && pathname == "/api/posts"){
            const editedPost = await request.json();
            return handleUpdatePost(editedPost.id, editedPost.title, editedPost.content);
        }
        
        if (method == "DELETE" && pathname == "/api/posts"){
            const {id} = await request.json();
            return handleDeletePost(id);
        }

        return new Response('Not Found', {status: 404});
    }
});


console.log("Server is running on port", PORT);