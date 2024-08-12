// const express = require("express");

const socket = io();
//emit means tule fela. for example frontend theke backend ae tule fela.
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML=""; // this makes the chessboard clean 
    board.forEach((row, rowindex) => {
        row.forEach((square, squareindex) => {
           const squareElement = document.createElement("div");
           squareElement.classList.add(
            "sqaure", // sometimes light sometimes dark
            (rowindex + squareindex) % 2 === 0 ? "light" : "dark" // this is basically for the pattern of light and dark squares of a chess board
           );

           squareElement.dataset.row = rowindex;
           squareElement.dataset.col = squareindex;

           if (square) {
            const pieceElement = document.createElement("div");
            pieceElement.classList.add(
            "piece", 
            square.color === "w" ? "white" : "black")
            pieceElement.innerText = "";
            pieceElement.draggable = playerRole === square.color;

            pieceElement.addEventListener("dragstart", () => {
                if(pieceElement.draggable){
                    draggedPiece = pieceElement;
                    sourceSquare = {row: rowindex, col: squareindex };
                    e.dataTransfer.setData("text/plain", ""); // necessity for draggability in chess board
                }
            })
        
        pieceElement.addEventListener("dragged", (e) => {
            draggedPiece = null;
            sourceSquare = null;
        })
        
        squareElement.appendChild(pieceElement) // we add piece in a back ( pechoner ) square
        }

        squareElement.addEventListener("dragged", function (e) {
            e.preventDefault();
        });

        squareElement.addEventListener("drop", function (e) {
            e.preventDefault();
            if(draggedPiece){
                const targetSource = {
                    row: parseInt(squareElement.dataset.row),
                    col : parseInt(squareElement.dataset.col),
                }
                handleMove(sourceSquare, targetSource);
            }
        })
            boardElement.appendChild(squareElement);
        });
        
    });
   
};

const handleMove = () => {};

const getPieceUnicode = () => {}

renderBoard();