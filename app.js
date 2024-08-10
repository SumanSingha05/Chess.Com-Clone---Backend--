const express = require("express");
const socket = require("socket.io");
const http = require ("http");
const { Chess } = require ("chess.js");
const path = require ("path");
const { title } = require("process");

const app = express();

const server = http.createServer(app);
const io = socket(server)

const chess = new Chess()
let players = {};
let currentPlayer = "W";

app.set("view engine", "ejs"); // by this we can use ejs which is very much similar to html
app.use(express.static(path.join(__dirname,"public"))); // by this we can use our static files vanila js, css etc

app.get("/", (req,res) => {
    res.render("index", {title: "Chess Game"});
});

io.on("connection", function(uniquesocket/*unique information about new person*/){
    console.log("connected");

    if(!players.white){
        players.white = uniquesocket.id
        uniquesocket.emit("playerRole", "w");
    }

    else if(!players.black){
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "b");
    }

    else{
        uniquesocket.emit("spectatorRole")
    }

    uniquesocket.on("disconnect", function() {
        if (uniquesocket.id === players.white) {
            delete players.white;
        }
        else if (uniquesocket.id === players.black) {
            delete players.black;
        }
    })

    uniquesocket.on("move",(move) =>{
        try {
           if (chess.turn() === "w" && uniquesocket.id !== players.white) return;
           if(chess.turn() === "b" && uniquesocket.id !== players.black) return;
        
        const result = chess.move(move); 
        if(result){
            currentPlayer = chess.turn()
            io.emit("move", move);
            io.emit("boardState", chess.fen())
            //chess.fen shows / updates the current state of the board...
        } 
          else {
            console.log("Invalid Move : ", move);
            uniquesocket.emit("invalidMove", move);
          }
        
        } catch (err) {
            uniquesocket.emit("Invalid move: ", move);
        }
    })

});

server.listen(3000, function () {
    console.log("listening on port 3000");
});
