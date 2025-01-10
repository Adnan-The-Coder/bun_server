import { serve } from "bun";
import figlet from "figlet";

const PORT = 3049;

serve({
    port:PORT,
    async fetch(request){
        const body = figlet.textSync("Hey There !");
        return new Response(body);
    }
});


console.log("Server is running on port", PORT);